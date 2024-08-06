"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processProfileVariables = exports.buildProfileMap = exports.replaceVariable = exports.parseProfile = exports.UnitLables = exports.VariableRegex = void 0;
const errors_1 = require("./errors");
__exportStar(require("./Dynamics"), exports);
__exportStar(require("./ExitTriggers"), exports);
__exportStar(require("./Limits"), exports);
__exportStar(require("./Stage"), exports);
__exportStar(require("./Variables"), exports);
exports.VariableRegex = /^\$.*$/;
exports.UnitLables = {
    pressure: 'bar',
    flow: 'ml/s',
    power: '%',
    time: 'sec',
    weight: 'gr',
    piston_position: '%',
    temperature: '°C'
};
function validateVariableOrValues(profile) {
    // Validate dynamics in stages
    profile.stages.forEach((stage) => {
        var _a, _b;
        stage.dynamics.points.forEach((point) => {
            point.forEach((value) => {
                if (typeof value === 'string' && !exports.VariableRegex.test(value)) {
                    throw new Error(`Invalid format for dynamics point value: ${value}`);
                }
            });
        });
        // Validate exit triggers
        (_a = stage.exit_triggers) === null || _a === void 0 ? void 0 : _a.forEach((trigger) => {
            if (typeof trigger.value === 'string' &&
                !exports.VariableRegex.test(trigger.value)) {
                throw new Error(`Invalid format for exit trigger value: ${trigger.value}`);
            }
        });
        // Validate limits
        (_b = stage.limits) === null || _b === void 0 ? void 0 : _b.forEach((limit) => {
            if (typeof limit.value === 'string' && !exports.VariableRegex.test(limit.value)) {
                throw new Error(`Invalid format for limit value: ${limit.value}`);
            }
        });
    });
}
function parseProfile(jsonString) {
    const tempProfile = JSON.parse(jsonString);
    validateVariableOrValues(tempProfile);
    return tempProfile;
}
exports.parseProfile = parseProfile;
function replaceVariable(valueOrVariable, expectedType, variablesMap) {
    if (typeof valueOrVariable === 'string') {
        if (!valueOrVariable.startsWith('$')) {
            throw new errors_1.FormatException(`Entry ${valueOrVariable} is not referencing a variable but is a string`);
        }
        const varKey = valueOrVariable.substring(1);
        if (!(varKey in variablesMap)) {
            throw new errors_1.UndefinedVariableException(`Variable ${varKey} is not defined`);
        }
        const { value: varValue, type: varType } = variablesMap[varKey];
        if (varType !== expectedType) {
            throw new errors_1.VariableTypeException(`Variable ${varKey} of type ${varType} used as ${expectedType}`);
        }
        return varValue;
    }
    return valueOrVariable;
}
exports.replaceVariable = replaceVariable;
function buildProfileMap(profile) {
    var _a;
    // Build a lookup table for cleaner code
    const variablesMap = {};
    (_a = profile.variables) === null || _a === void 0 ? void 0 : _a.forEach((varEntry) => {
        variablesMap[varEntry.key] = varEntry;
    });
    return variablesMap;
}
exports.buildProfileMap = buildProfileMap;
function processProfileVariables(originalProfile) {
    var _a;
    const profile = JSON.parse(JSON.stringify(originalProfile));
    const variablesMap = buildProfileMap(profile);
    try {
        (_a = profile.stages) === null || _a === void 0 ? void 0 : _a.forEach((stage, stageIndex) => {
            var _a, _b;
            if (!('type' in stage)) {
                throw new errors_1.FormatException(`stage ${stageIndex} missing 'type' field`);
            }
            if (!('dynamics' in stage)) {
                throw new errors_1.FormatException(`stage ${stageIndex} missing 'dynamics' field`);
            }
            if (!('points' in stage.dynamics)) {
                throw new errors_1.FormatException(`stage ${stageIndex} dynamics are missing the points array`);
            }
            const stageType = stage.type;
            stage.dynamics.points.forEach((point) => {
                const pointXType = stage.dynamics.over || 'time';
                point[0] = replaceVariable(point[0], pointXType, variablesMap);
                point[1] = replaceVariable(point[1], stageType, variablesMap);
            });
            (_a = stage.exit_triggers) === null || _a === void 0 ? void 0 : _a.forEach((trigger, triggerIndex) => {
                if (!('type' in trigger)) {
                    throw new errors_1.FormatException(`exitTrigger ${triggerIndex} missing 'type' field`);
                }
                if (!('value' in trigger)) {
                    throw new errors_1.FormatException(`exitTrigger ${triggerIndex} missing 'value' field`);
                }
                trigger.value = replaceVariable(trigger.value, trigger.type, variablesMap);
            });
            (_b = stage.limits) === null || _b === void 0 ? void 0 : _b.forEach((limit, limitIndex) => {
                if (!('type' in limit)) {
                    throw new errors_1.FormatException(`limit ${limitIndex} missing 'type' field`);
                }
                if (!('value' in limit)) {
                    throw new errors_1.FormatException(`limit ${limitIndex} missing 'value' field`);
                }
                limit.value = replaceVariable(limit.value, limit.type, variablesMap);
            });
        });
    }
    catch (e) {
        if (e instanceof Error) {
            throw new errors_1.FormatException(`Error processing profile: ${e.message}`);
        }
    }
    return profile;
}
exports.processProfileVariables = processProfileVariables;
//# sourceMappingURL=index.js.map