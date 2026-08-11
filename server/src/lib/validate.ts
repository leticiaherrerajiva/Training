import type { ZodType, ZodTypeDef } from 'zod';
import { ValidationError } from './errors';

/** Parse input with a zod schema; throw ValidationError (400) with the issues as details. */
export function parseWith<Output, Def extends ZodTypeDef, Input>(
  schema: ZodType<Output, Def, Input>,
  input: unknown,
): Output {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ValidationError('Invalid request', result.error.issues);
  }
  return result.data;
}
