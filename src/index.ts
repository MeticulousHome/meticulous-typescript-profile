import { Display } from './Display';
import { ExitTrigger } from './ExitTriggers';
import { Limit } from './Limits';
import { Stage } from './Stage';
import { Variable, VariableKey } from './Variables';
import {
  FormatException,
  UndefinedVariableException,
  VariableTypeException
} from './errors';
import { Point } from './Dynamics';

export * from './Dynamics';
export * from './ExitTriggers';
export * from './Limits';
export * from './Stage';
export * from './Variables';

export const VariableRegex = /^\$.*$/;
export type VariableOrValue = number | VariableKey;

export const UnitLables: Record<string, string> = {
  pressure: 'bar',
  flow: 'ml/s',
  power: '%',
  time: 'sec',
  weight: 'gr',
  piston_position: '%',
  temperature: '°C'
};

export interface PreviousAuthor {
  name: string;
  author_id: string;
  profile_id: string;
}

export interface Profile {
  name: string;
  id: string;
  display?: Display;
  author: string;
  author_id: string;
  previous_authors: PreviousAuthor[];
  temperature: number; // min: 0, max: 100
  final_weight: number; // min: 0, max: 2000
  variables: Variable[];
  stages: Stage[];
  last_changed?: number;
}

function validateVariableOrValues(profile: Profile) {
  // Validate dynamics in stages
  profile.stages.forEach((stage) => {
    stage.dynamics.points.forEach(
      (point: [VariableOrValue, VariableOrValue]) => {
        point.forEach((value) => {
          if (typeof value === 'string' && !VariableRegex.test(value)) {
            throw new Error(
              `Invalid format for dynamics point value: ${value}`
            );
          }
        });
      }
    );

    // Validate exit triggers
    stage.exit_triggers?.forEach((trigger) => {
      if (
        typeof trigger.value === 'string' &&
        !VariableRegex.test(trigger.value)
      ) {
        throw new Error(
          `Invalid format for exit trigger value: ${trigger.value}`
        );
      }
    });

    // Validate limits
    stage.limits?.forEach((limit) => {
      if (typeof limit.value === 'string' && !VariableRegex.test(limit.value)) {
        throw new Error(`Invalid format for limit value: ${limit.value}`);
      }
    });
  });
}

export function parseProfile(jsonString: string) {
  const tempProfile = JSON.parse(jsonString);

  validateVariableOrValues(tempProfile);

  return tempProfile as Profile;
}

export function replaceVariable(
  valueOrVariable: VariableOrValue,
  expectedType: string,
  variablesMap: { [key: string]: Variable }
): any {
  if (typeof valueOrVariable === 'string') {
    if (!valueOrVariable.startsWith('$')) {
      throw new FormatException(
        `Entry ${valueOrVariable} is not referencing a variable but is a string`
      );
    }
    const varKey = valueOrVariable.substring(1);
    if (!(varKey in variablesMap)) {
      throw new UndefinedVariableException(`Variable ${varKey} is not defined`);
    }
    const { value: varValue, type: varType } = variablesMap[varKey];
    if (varType !== expectedType) {
      throw new VariableTypeException(
        `Variable ${varKey} of type ${varType} used as ${expectedType}`
      );
    }
    return varValue;
  }
  return valueOrVariable;
}

export function buildProfileMap(profile: Profile): { [key: string]: Variable } {
  // Build a lookup table for cleaner code
  const variablesMap: { [key: string]: Variable } = {};
  profile.variables?.forEach((varEntry: Variable) => {
    variablesMap[varEntry.key] = varEntry;
  });
  return variablesMap;
}

export function processProfileVariables(originalProfile: Profile): Profile {
  const profile = JSON.parse(JSON.stringify(originalProfile));
  const variablesMap = buildProfileMap(profile);

  try {
    profile.stages?.forEach((stage: Stage, stageIndex: number) => {
      if (!('type' in stage)) {
        throw new FormatException(`stage ${stageIndex} missing 'type' field`);
      }

      if (!('dynamics' in stage)) {
        throw new FormatException(
          `stage ${stageIndex} missing 'dynamics' field`
        );
      }

      if (!('points' in stage.dynamics)) {
        throw new FormatException(
          `stage ${stageIndex} dynamics are missing the points array`
        );
      }

      const stageType = stage.type;
      stage.dynamics.points.forEach((point: Point) => {
        const pointXType = stage.dynamics.over || 'time';
        point[0] = replaceVariable(point[0], pointXType, variablesMap);
        point[1] = replaceVariable(point[1], stageType, variablesMap);
      });

      stage.exit_triggers?.forEach(
        (trigger: ExitTrigger, triggerIndex: number) => {
          if (!('type' in trigger)) {
            throw new FormatException(
              `exitTrigger ${triggerIndex} missing 'type' field`
            );
          }
          if (!('value' in trigger)) {
            throw new FormatException(
              `exitTrigger ${triggerIndex} missing 'value' field`
            );
          }

          trigger.value = replaceVariable(
            trigger.value,
            trigger.type,
            variablesMap
          );
        }
      );

      stage.limits?.forEach((limit: Limit, limitIndex: number) => {
        if (!('type' in limit)) {
          throw new FormatException(`limit ${limitIndex} missing 'type' field`);
        }
        if (!('value' in limit)) {
          throw new FormatException(
            `limit ${limitIndex} missing 'value' field`
          );
        }

        limit.value = replaceVariable(limit.value, limit.type, variablesMap);
      });
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new FormatException(`Error processing profile: ${e.message}`);
    }
  }

  return profile;
}
