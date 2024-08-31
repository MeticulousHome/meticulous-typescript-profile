"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitTriggerNames = exports.ExitTriggerRelativeAllowed = void 0;
exports.ExitTriggerRelativeAllowed = {
    pressure: false,
    flow: false,
    power: false,
    time: true,
    weight: true,
    piston_position: true,
    user_interaction: false
};
exports.ExitTriggerNames = {
    pressure: 'Pressure',
    time: 'Time',
    weight: 'Weight',
    piston_position: 'Piston Position',
    power: 'Motor Power',
    user_interaction: 'Encoder Press',
    flow: 'Flow'
};
//# sourceMappingURL=ExitTriggers.js.map