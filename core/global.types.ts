/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};

  type UnionToIntersection<T> = Prettify<
    (T extends any ? (x: T) => any : never) extends (x: infer R) => any
      ? R
      : never
  >;

  interface PageProps<
    TParams extends string = never,
    TSearchParams extends string = never
  > {
    params: Promise<
      UnionToIntersection<
        {
          [K in TParams]: {
            [F in K extends `...${infer U}` ? U : K]: K extends `...${string}`
              ? string[]
              : string;
          };
        }[TParams]
      >
    >;
    searchParams: Promise<{ [K in TSearchParams]?: string | string[] }>;
  }
}
