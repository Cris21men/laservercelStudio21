export class AudioSystem {
  private static instance: AudioSystem;
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private isInitialized = false;
  private isMuted = false;

  static getInstance(): AudioSystem {
    if (!AudioSystem.instance) {
      AudioSystem.instance = new AudioSystem();
    }
    return AudioSystem.instance;
  }

  async initialize(): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      // Solo crear AudioContext si no existe
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      console.log("🎵 Inicializando sistema de audio...");

      // Precargar sonidos
      this.sounds = {
        shoot: this.createAudio('/audio/shoot.wav'),
        correct: this.createAudio('/audio/correct.wav'), 
        wrong: this.createAudio('/audio/wrong.wav'),
        background: this.createAudio('/audio/background.mp3'),
      };

      // Configurar sonido de fondo
      this.sounds.background.loop = true;
      this.sounds.background.volume = 0.3;

      // Configurar volúmenes
      this.sounds.shoot.volume = 0.4;
      this.sounds.correct.volume = 0.6;
      this.sounds.wrong.volume = 0.6;

      // Cargar preferencia de silencio
      const savedMuteState = localStorage.getItem('gameMuted');
      this.isMuted = savedMuteState === 'true';

      this.isInitialized = true;
      console.log("✅ Sistema de audio inicializado");

    } catch (error) {
      console.error("❌ Error inicializando audio:", error);
    }
  }

  private createAudio(src: string): HTMLAudioElement {
    const audio = new Audio();
    audio.src = src;
    audio.preload = 'auto';
    
    // Eventos para debug
    audio.addEventListener('canplaythrough', () => {
      console.log(`✅ Audio cargado: ${src}`);
    });
    
    audio.addEventListener('error', (e) => {
      console.error(`❌ Error cargando audio ${src}:`, e);
    });

    return audio;
  }

  async play(soundName: string): Promise<void> {
    // Auto-inicializar si no está listo
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isMuted) {
      console.log(`🔇 Audio silenciado: ${soundName}`);
      return;
    }

    const sound = this.sounds[soundName];
    if (!sound) {
      console.error(`❌ Sonido no encontrado: ${soundName}`);
      return;
    }

    try {
      // Reiniciar el audio
      sound.currentTime = 0;
      
      // Intentar reproducir
      const playPromise = sound.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log(`🎵 Reproduciendo: ${soundName}`);
      }
    } catch (error) {
      console.error(`❌ Error reproduciendo ${soundName}:`, error);
    }
  }

  async playBackground(): Promise<void> {
    // Auto-inicializar si no está listo
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isMuted) {
      console.log("🔇 Música de fondo silenciada");
      return;
    }

    try {
      const backgroundSound = this.sounds.background;
      if (backgroundSound) {
        backgroundSound.currentTime = 0;
        const playPromise = backgroundSound.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log("🎵 Música de fondo iniciada");
        }
      }
    } catch (error) {
      console.error("❌ Error reproduciendo música de fondo:", error);
      console.log("💡 Haz clic en cualquier parte para activar el audio");
    }
  }

  stopBackground(): void {
    const backgroundSound = this.sounds.background;
    if (backgroundSound) {
      backgroundSound.pause();
      backgroundSound.currentTime = 0;
      console.log("⏹️ Música de fondo detenida");
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('gameMuted', this.isMuted.toString());
    
    console.log(`🔊 Audio ${this.isMuted ? 'silenciado' : 'activado'}`);

    if (!this.isMuted && this.sounds.background) {
      this.playBackground();
    } else if (this.isMuted && this.sounds.background) {
      this.stopBackground();
    }

    return this.isMuted;
  }
}