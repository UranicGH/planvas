/**
 * Defines the type format of the config object.  Note that it
 * is also recursive.
 */
export type Config = string | number | boolean | null | Config[] | { [key: string]: Config };