import { VariableOrValue } from '.';
export type ExitTriggerComparison = '>=' | '<=';
export declare const ExitTriggerRelativeAllowed: Record<ExitTriggerType, boolean>;
export type ExitTriggerType = 'time' | 'weight' | 'pressure' | 'flow' | 'piston_position' | 'power' | 'user_interaction';
export declare const ExitTriggerNames: Record<ExitTriggerType, string>;
export interface ExitTrigger {
    type: ExitTriggerType;
    value: VariableOrValue;
    relative?: boolean;
    comparison?: ExitTriggerComparison;
}
//# sourceMappingURL=ExitTriggers.d.ts.map