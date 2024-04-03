import { Stage } from './Stage';
import { Variable } from './Variables';
import {
  FormatException,
  UndefinedVariableException,
  VariableTypeException
} from './errors';
import { UUID } from './uuid';

export * from './Dynamics';
export * from './ExitTriggers';
export * from './Limits';
export * from './Stage';
export * from './Variables';

export const VariableRegex = /^\$.*$/;
export type VariableOrValue = number | string;

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
  author_id: UUID;
  profile_id: UUID;
}

export interface Profile {
  name: string;
  id: UUID;
  author: string;
  author_id: UUID;
  previous_authors: PreviousAuthor[];
  temperature: number; // min: 0, max: 100
  final_weight: number; // min: 0, max: 2000
  variables: Variable[];
  stages: Stage[];
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

  // Convert author_id and profile_id in previous_authors to UUID instances
  tempProfile.previous_authors = tempProfile.previous_authors.map(
    (author: any) => ({
      ...author,
      author_id: new UUID(author.author_id),
      profile_id: new UUID(author.profile_id)
    })
  );

  tempProfile.id = new UUID(tempProfile.id);
  tempProfile.author_id = new UUID(tempProfile.author_id);

  validateVariableOrValues(tempProfile);

  return tempProfile as Profile;
}

function replaceVariable(
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

export function processProfileVariables(profile: Profile): Profile {
  // Build a lookup table for cleaner code
  const variablesMap: { [key: string]: Variable } = {};
  profile.variables?.forEach((varEntry) => {
    variablesMap[varEntry.key] = varEntry;
  });

  try {
    profile.stages?.forEach((stage, stageIndex) => {
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
      stage.dynamics.points.forEach((point) => {
        const pointXType = stage.dynamics.over || 'time';
        point[0] = replaceVariable(point[0], pointXType, variablesMap);
        point[1] = replaceVariable(point[1], stageType, variablesMap);
      });

      stage.exit_triggers?.forEach((trigger, triggerIndex) => {
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
      });

      stage.limits?.forEach((limit, limitIndex) => {
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
