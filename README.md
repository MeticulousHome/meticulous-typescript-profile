# meticulous-typescript-profile

Typescript definitions do deal with the meticulous profiles

## Installation

This package is hosted on npmjs.com:

```
npm install @meticulous-home/espresso-profile
```

Additionally the build is automatically pushed to the `dist` branch.
To install it from there run

```typescript
npm install "git@github.com:MeticulousHome/meticulous-typescript-profile.git#dist"
```

## Exit trigger comparisons

Numeric exit triggers support four comparison operators: greater than (`>`),
less than (`<`), greater than or equal to (`>=`), and less than or equal to
(`<=`). Each explicit operator keeps its own strict or inclusive boundary
semantics. When `comparison` is omitted, consumers retain the existing
greater-than-or-equal (`>=`) behavior.
