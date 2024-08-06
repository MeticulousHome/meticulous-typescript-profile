"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatException = exports.VariableTypeException = exports.UndefinedVariableException = void 0;
// Custom exceptions for profile processing
class UndefinedVariableException extends Error {
    constructor(message) {
        super(message);
        this.name = 'UndefinedVariableException';
    }
}
exports.UndefinedVariableException = UndefinedVariableException;
class VariableTypeException extends Error {
    constructor(message) {
        super(message);
        this.name = 'VariableTypeException';
    }
}
exports.VariableTypeException = VariableTypeException;
class FormatException extends Error {
    constructor(message) {
        super(message);
        this.name = 'FormatException';
    }
}
exports.FormatException = FormatException;
//# sourceMappingURL=errors.js.map