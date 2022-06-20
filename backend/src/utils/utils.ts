export const DEFAULT_PAGE = 1;
export const DEFAULT_SIZE = 10;

/**
 * Prepare query string filter to array of filter item values.
 *
 * @param filter
 */
export function prepareFilterValues(filter: string): any[] {
  return filter
    .split(',')
    .map((value) => isNaN(Number(value)) ? new RegExp(value, "i") : Number(value));
}
