import { VariableOrValue } from '.';
export type LimitType = 'pressure' | 'flow';
export declare const LimitNames: Record<LimitType, string>;
export interface Limit {
    type: LimitType;
    value: VariableOrValue;
}
//# sourceMappingURL=Limits.d.ts.map