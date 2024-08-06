import { VariableOrValue } from '.';
export type DynamicsInterpolationOverType = 'piston_position' | 'time' | 'weight';
export type DynamicsInterpolationType = 'none' | 'linear' | 'curve';
export type Point = [VariableOrValue, VariableOrValue];
export interface Dynamics {
    points: Point[];
    over: DynamicsInterpolationOverType;
    interpolation: DynamicsInterpolationType;
}
//# sourceMappingURL=Dynamics.d.ts.map