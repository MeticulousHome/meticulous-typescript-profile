import { VariableOrValue } from '.';

export type DynamicsInterpolationOverType =
  | 'piston_position'
  | 'time'
  | 'weight';
export type DynamicsInterpolationType = 'none' | 'linear' | 'curve';

export interface Dynamics {
  points: [VariableOrValue, VariableOrValue][]; // required
  over: DynamicsInterpolationOverType; // required
  interpolation: DynamicsInterpolationType; // required
}
