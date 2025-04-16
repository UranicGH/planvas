// A list of eligible page sizes.
export const pageSizeOptions = [
  // eslint-disable-next-line no-magic-numbers
  5, 10, 15, 30, 100
] as const;
// The "as const" is not reduntant.  It says that the literal values on the right are also const.
// This allows those values to be used to restrict the type to only allow those values.

// A type that contrains values to those in the list of page size options.
export type PageSizeOption = typeof pageSizeOptions[number];