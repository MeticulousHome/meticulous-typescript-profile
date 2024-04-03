export type VariableType =
  | 'power'
  | 'flow'
  | 'pressure'
  | 'weight'
  | 'time'
  | 'piston_position';

export interface Variable {
  name: string;
  key: string;
  type: VariableType;
  value: number;
}
