// Ambient declaration for satori@0.26.
//
// The package's "." export map has no `types` condition and the file its
// top-level `types` field points at (dist/index.d.ts) is not shipped, so under
// bundler module resolution TypeScript can't find types for `import satori from
// 'satori'` and falls back to `any` (ts7016). This shim restores typing for the
// subset of the API we use in src/lib/og.ts. Remove it if a future satori
// version ships a `types` condition on its main entry.
declare module 'satori' {
  import type { ReactNode } from 'react';

  export interface SatoriFont {
    name: string;
    data: ArrayBuffer | Uint8Array;
    weight?: number;
    style?: 'normal' | 'italic';
  }

  export interface SatoriOptions {
    width: number;
    height: number;
    fonts: SatoriFont[];
    embedFont?: boolean;
  }

  export default function satori(
    element: ReactNode,
    options: SatoriOptions,
  ): Promise<string>;
}
