import { Operation } from '../types/game';

export const operations = {
  generateLevel1: (): Operation => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    return {
      question: `${a}+${b}`,
      answer: a + b
    };
  },

  generateLevel2: (): Operation => {
    const a = Math.floor(Math.random() * 20);
    const b = Math.floor(Math.random() * 20);
    const op = Math.random() < 0.5 ? '+' : '-';
    return {
      question: `${a}${op}${b}`,
      answer: op === '+' ? a + b : a - b
    };
  },

  generateLevel3: (): Operation => {
    const a = Math.floor(Math.random() * 12);
    const b = Math.floor(Math.random() * 12);
    return {
      question: `${a}×${b}`,
      answer: a * b
    };
  },

  generateHarder: (): Operation => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 20 + 1); // evitar división entre 0
    const opIndex = Math.floor(Math.random() * 4);
    const ops = ['+', '-', '×', '÷'];
    const op = ops[opIndex];

    let question: string;
    let answer: number;

    switch (op) {
      case '+':
        question = `${a}+${b}`;
        answer = a + b;
        break;
      case '-':
        question = `${a}-${b}`;
        answer = a - b;
        break;
      case '×':
        question = `${a}×${b}`;
        answer = a * b;
        break;
      case '÷':
        question = `${a}÷${b}`;
        answer = Math.floor(a / b); // división entera
        break;
      default:
        question = `${a}+${b}`;
        answer = a + b;
    }

    return { question, answer };
  }
};

export function generateOperation(level: number): Operation {
  if (level <= 2) return operations.generateLevel1();
  if (level <= 4) return operations.generateLevel2();
  if (level <= 9) return operations.generateLevel3();
  return operations.generateHarder();
}