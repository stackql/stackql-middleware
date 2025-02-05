// types/context.types.ts
import { Context as OakContext } from "jsr:@oak/oak/context";

export interface Context extends OakContext {
  user?: {
    id: string;
    [key: string]: unknown;
  };
}