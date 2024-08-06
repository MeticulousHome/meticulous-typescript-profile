"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVariableReferences = void 0;
function findVariableReferences(profile, variableKey) {
    var result = { key: variableKey, stages: [] };
    const stages = profile.stages;
    stages.forEach((stage, stageIndex) => {
        const points = stage.dynamics.points
            .map((point, index) => ({ point, index }))
            .filter(({ point }) => point[0] === variableKey || point[1] === variableKey);
        const exitTriggers = (stage.exit_triggers || [])
            .map((trigger, index) => ({ trigger, index }))
            .filter(({ trigger }) => trigger.value === variableKey);
        const limits = (stage.limits || [])
            .map((limit, index) => ({ limit, index }))
            .filter(({ limit }) => limit.value === variableKey);
        if (points.length > 0 || exitTriggers.length > 0 || limits.length > 0) {
            const referencesInStage = {
                index: stageIndex,
                key: stage.key,
                points: [],
                exit_triggers: [],
                limits: []
            };
            result.stages.push(referencesInStage);
        }
    });
    return result;
}
exports.findVariableReferences = findVariableReferences;
//# sourceMappingURL=Variables.js.map