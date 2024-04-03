import { VariableOrValue } from '.';

export type LimitType = 'pressure' | 'flow';
export const LimitNames: Record<LimitType, string> = {
  pressure: 'Pressure',
  flow: 'Flow'
};

export interface Limit {
  type: LimitType;
  value: VariableOrValue;
}
