export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type ExclusiveUnion<T> = {
  [K in keyof T]: { [P in K]: T[K] };
}[keyof T];

export type Primitive = string | boolean | number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic typing
export type RecursiveRecord<T = any> =
  | {
      [key: string]: T | RecursiveRecord<T>;
    }
  | Record<string, never>;
