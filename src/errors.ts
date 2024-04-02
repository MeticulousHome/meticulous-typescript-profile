// Custom exceptions for profile processing
export class UndefinedVariableException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UndefinedVariableException';
  }
}

export class VariableTypeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VariableTypeException';
  }
}

export class FormatException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormatException';
  }
}
