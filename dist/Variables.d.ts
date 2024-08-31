import { ExitTrigger, Limit, Point, Profile, StageKey } from '.';
export type VariableType = 'power' | 'flow' | 'pressure' | 'weight' | 'time' | 'piston_position';
export type VariableKey = string;
export interface Variable {
    name: string;
    key: VariableKey;
    type: VariableType;
    value: number;
}
export interface VariablePointReference {
    point: Point;
    index: number;
}
export interface VariableExitTriggerReference {
    trigger: ExitTrigger;
    index: number;
}
export interface VariableLimitReference {
    limit: Limit;
    index: number;
}
export interface VariableStageReference {
    index: number;
    key?: StageKey;
    points: VariablePointReference[];
    exit_triggers: VariableExitTriggerReference[];
    limits: VariableLimitReference[];
}
export interface VariableReference {
    key: VariableKey;
    stages: VariableStageReference[];
}
export declare function findVariableReferences(profile: Profile, variableKey: VariableKey): VariableReference;
//# sourceMappingURL=Variables.d.ts.map