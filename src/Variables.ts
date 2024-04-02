export type VariableType =
  | 'power'
  | 'flow'
  | 'pressure'
  | 'weight'
  | 'time'
  | 'piston_position';

export interface Variable {
  name: string; // required
  key: string; // required
  type: VariableType; // required
  value: number; // required
}
