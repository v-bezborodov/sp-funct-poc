// keep error messages here so we can turn it to i18n later
// TODO: as for now multi lang is not supported

export const ERROR_CODES = {
    TITLE_TOO_SHORT: "errors.validation.title_too_short",
    TITLE_TOO_LONG: "errors.validation.title_too_long",
    CONTENT_TOO_SHORT: "errors.validation.content_too_short",
    UNAUTHORIZED: "errors.auth.unauthorized",
  } as const;
  
  // Types for your translation files
  export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];