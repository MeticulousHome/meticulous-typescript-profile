import { VariableOrValue } from '.';

export type ExitTriggerComparison = '>=' | '<=';

export const ExitTriggerRelativeAllowed: Record<ExitTriggerType, boolean> = {
  pressure: false,
  flow: false,
  power: false,
  time: true,
  weight: true,
  piston_position: true,
  user_interaction: false
};

export type ExitTriggerType =
  | 'time'
  | 'weight'
  | 'pressure'
  | 'flow'
  | 'piston_position'
  | 'power'
  | 'user_interaction';

export const ExitTriggerNames: Record<ExitTriggerType, string> = {
  pressure: 'Pressure',
  time: 'Time',
  weight: 'Weight',
  piston_position: 'Piston Position',
  power: 'Motor Power',
  user_interaction: 'Encoder Press',
  flow: 'Flow'
};

export interface ExitTrigger {
  type: ExitTriggerType; // required
  value: VariableOrValue; // required
  relative?: boolean;
  comparison?: ExitTriggerComparison; // ">=" is assumed if non existant
}
