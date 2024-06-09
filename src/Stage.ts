import { Dynamics } from './Dynamics';
import { ExitTrigger } from './ExitTriggers';
import { Limit } from './Limits';

export type StageType = 'power' | 'flow' | 'pressure';
export const StageTypeNames: Record<StageType, string> = {
  pressure: 'Pressure',
  flow: 'Flow',
  power: 'Motor Power'
};

export type StageKey = string;

export interface Stage {
  name: string;
  key: StageKey;
  temperature_delta?: number; // min: -100, max: 100
  type: StageType;
  dynamics: Dynamics;
  exit_triggers?: ExitTrigger[];
  limits?: Limit[];
}
