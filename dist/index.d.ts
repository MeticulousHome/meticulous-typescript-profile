import { Display } from './Display';
import { Stage } from './Stage';
import { Variable, VariableKey } from './Variables';
export * from './Dynamics';
export * from './ExitTriggers';
export * from './Limits';
export * from './Stage';
export * from './Variables';
export declare const VariableRegex: RegExp;
export type VariableOrValue = number | VariableKey;
export declare const UnitLables: Record<string, string>;
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
    temperature: number;
    final_weight: number;
    variables: Variable[];
    stages: Stage[];
}
export declare function parseProfile(jsonString: string): Profile;
export declare function replaceVariable(valueOrVariable: VariableOrValue, expectedType: string, variablesMap: {
    [key: string]: Variable;
}): any;
export declare function buildProfileMap(profile: Profile): {
    [key: string]: Variable;
};
export declare function processProfileVariables(originalProfile: Profile): Profile;
//# sourceMappingURL=index.d.ts.map