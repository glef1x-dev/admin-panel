import * as _ from 'lodash-es';

/**
 * Find difference between two objects
 * @param  {object} origObj - Source object to compare newObj against
 * @param  {object} newObj  - New object with potential changes
 * @return {object} differences
 */
export function difference(origObj: object, newObj: object) {
    function changes(newObj: object, origObj: object) {
        let arrayIndexCounter = 0;
        return _.transform(newObj, function (result, value, key) {
            if (!_.isEqual(value, origObj[key])) {
                let resultKey = Array.isArray(origObj) ? arrayIndexCounter++ : key;
                result[resultKey] =
                    _.isObject(value) && _.isObject(origObj[key]) ? changes(value, origObj[key]) : value;
            }
        });
    }
    return changes(newObj, origObj);
}
