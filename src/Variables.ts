import { ExitTrigger, Limit, Point, Profile, StageKey } from '.';

export type VariableType =
  | 'power'
  | 'flow'
  | 'pressure'
  | 'weight'
  | 'time'
  | 'piston_position';

export type VariableKey = string;
export interface Variable {
  name: string;
  key: VariableKey;
  type: VariableType;
  value: number;
}

export interface VariablePointReference {
  point: Point;
  index: number;
}

export interface VariableExitTriggerReference {
  trigger: ExitTrigger;
  index: number;
}

export interface VariableLimitReference {
  limit: Limit;
  index: number;
}
export interface VariableStageReference {
  index: number;
  key?: StageKey;
  points: VariablePointReference[];
  exit_triggers: VariableExitTriggerReference[];
  limits: VariableLimitReference[];
}
export interface VariableReference {
  key: VariableKey;
  stages: VariableStageReference[];
}

export function findVariableReferences(
  profile: Profile,
  variableKey: VariableKey
): VariableReference {
  var result: VariableReference = { key: variableKey, stages: [] };

  const stages = profile.stages;
  stages.forEach((stage, stageIndex) => {
    const points: VariablePointReference[] = stage.dynamics.points
      .map((point, index) => ({ point, index }))
      .filter(
        ({ point }) => point[0] === variableKey || point[1] === variableKey
      );

    const exitTriggers: VariableExitTriggerReference[] = (
      stage.exit_triggers || []
    )
      .map((trigger, index) => ({ trigger, index }))
      .filter(({ trigger }) => trigger.value === variableKey);

    const limits: VariableLimitReference[] = (stage.limits || [])
      .map((limit, index) => ({ limit, index }))
      .filter(({ limit }) => limit.value === variableKey);

    if (points.length > 0 || exitTriggers.length > 0 || limits.length > 0) {
      const referencesInStage: VariableStageReference = {
        index: stageIndex,
        key: stage.key,
        points: [],
        exit_triggers: [],
        limits: []
      };
      result.stages.push(referencesInStage);
    }
  });

  return result;
}
