import * as _ from 'lodash-es';

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
export function difference(
  origObj: Record<string, unknown>,
  newObj: Record<string, unknown>,
): Record<string, unknown> {
  const objectDiffRecursive = (obj1: Record<string, unknown>, obj2: Record<string, unknown>) => {
    let arrayIndexCounter = 0;
    return _.transform(obj1, (result: Record<string, unknown>, value: unknown, key) => {
      if (!_.isEqual(value, obj2[key])) {
        const resultKey = Array.isArray(obj2) ? arrayIndexCounter++ : key;

        const maybeObject = obj2[key];
        if (isObject(value) && isObject(maybeObject)) {
          result[resultKey] = objectDiffRecursive(value, maybeObject);
        } else {
          result[resultKey] = value;
        }
      }
    });
  };

  return objectDiffRecursive(newObj, origObj);
}

function isObject(input: unknown): input is Record<string, unknown> {
  const type = typeof input;
  return input != null && (type === 'object' || type === 'function');
}
