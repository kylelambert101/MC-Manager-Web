/**
 * Name and dataType of a property on an object
 */
export type TypedProperty = {
  name: string;
  dataType: string;
};

/**
 * Get the name and datatype of all properties of an object
 * @param object Object to analyze
 */
export const getProperties = (
  object: Record<string, unknown>
): TypedProperty[] => {
  return Object.keys(object).map((key) => ({
    name: key,
    dataType: typeof object[key],
  }));
};
