import { Dynamics } from './Dynamics';
import { ExitTrigger } from './ExitTriggers';
import { Limit } from './Limits';
export type StageType = 'power' | 'flow' | 'pressure';
export declare const StageTypeNames: Record<StageType, string>;
export type StageKey = string;
export interface Stage {
    name: string;
    key: StageKey;
    temperature_delta?: number;
    type: StageType;
    dynamics: Dynamics;
    exit_triggers?: ExitTrigger[];
    limits?: Limit[];
}
//# sourceMappingURL=Stage.d.ts.map