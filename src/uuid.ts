import { validate } from 'uuid';

export class UUID {
  private value: string;

  constructor(uuidString: string) {
    this.value = uuidString;
  }

  toString(): string {
    return this.value;
  }
}
