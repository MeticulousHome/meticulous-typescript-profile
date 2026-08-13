import type {
  ExitTrigger,
  ExitTriggerComparison,
  ExitTriggerType
} from '../src';

const greaterThan: ExitTriggerComparison = '>';
const lessThan: ExitTriggerComparison = '<';
const greaterThanOrEqual: ExitTriggerComparison = '>=';
const lessThanOrEqual: ExitTriggerComparison = '<=';

const numericTriggerTypes = [
  'weight',
  'time',
  'pressure',
  'flow',
  'piston_position',
  'power'
] as const satisfies readonly ExitTriggerType[];

const comparisons = [
  greaterThan,
  lessThan,
  greaterThanOrEqual,
  lessThanOrEqual
] as const;

const numericTriggers = numericTriggerTypes.reduce<ExitTrigger[]>(
  (triggers, type) => [
    ...triggers,
    ...comparisons.map((comparison) => ({ type, value: 0, comparison }))
  ],
  []
);

const omittedComparison: ExitTrigger = {
  type: 'weight',
  value: 0
};

// @ts-expect-error Equality is not a supported exit-trigger comparison.
const unsupportedEquality: ExitTriggerComparison = '==';

// @ts-expect-error Inequality is not a supported exit-trigger comparison.
const unsupportedInequality: ExitTriggerComparison = '!=';

void numericTriggers;
void omittedComparison;
void unsupportedEquality;
void unsupportedInequality;
