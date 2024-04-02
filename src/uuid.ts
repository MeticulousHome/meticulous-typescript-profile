import { validate } from 'uuid';

export class UUID {
  private value: string;

  constructor(uuidString: string) {
    if (!UUID.isValidUUID(uuidString)) {
      throw new Error('Invalid UUID format.');
    }
    this.value = uuidString;
  }

  static isValidUUID(uuid: string): boolean {
    return validate(uuid);
  }

  toString(): string {
    return this.value;
  }
}
