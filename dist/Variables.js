"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVariableReferences = findVariableReferences;
function findVariableReferences(profile, variableKey) {
    const stageRefs = profile.stages.map((stage, stageIndex) => {
        console.log('checking stage', stage.key);
        const points = stage.dynamics.points
            .map((point, index) => ({ point, index }))
            .filter(({ point }) => point[0] === '$' + variableKey || point[1] === '$' + variableKey);
        const exitTriggers = (stage.exit_triggers || [])
            .map((trigger, index) => ({ trigger, index }))
            .filter(({ trigger }) => trigger.value === '$' + variableKey);
        const limits = (stage.limits || [])
            .map((limit, index) => ({ limit, index }))
            .filter(({ limit }) => limit.value === '$' + variableKey);
        if (points.length > 0 || exitTriggers.length > 0 || limits.length > 0) {
            const referencesInStage = {
                index: stageIndex,
                key: stage.key,
                points: points,
                exit_triggers: exitTriggers,
                limits: limits,
            };
            return referencesInStage;
        }
        return;
    });
    return { key: variableKey, stages: stageRefs.filter((ref) => !!ref) };
}
//# sourceMappingURL=Variables.js.map