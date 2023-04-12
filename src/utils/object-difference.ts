import * as _ from 'lodash-es';

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
export function difference(origObj: Record<string, unknown>, newObj: Record<string, unknown>): Record<string, unknown> {
    function changes(newObj: Record<string, unknown>, origObj: Record<string, unknown>) {
        let arrayIndexCounter = 0;
        return _.transform(newObj, function (result: Record<string, unknown>, value: unknown, key) {
            if (!_.isEqual(value, origObj[key])) {
                const resultKey = Array.isArray(origObj) ? arrayIndexCounter++ : key;

                const maybeObject = origObj[key];
                if (isObject(value) && isObject(maybeObject)) {
                    result[resultKey] = changes(value, maybeObject);
                } else {
                    result[resultKey] = value;
                }
            }
        });
    }

    return changes(newObj, origObj);
}

function isObject(input: unknown): input is Record<string, unknown> {
    const type = typeof input
    return input != null && (type === 'object' || type === 'function')
}

