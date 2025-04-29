/* eslint-disable @typescript-eslint/no-explicit-any */
export function objectDiff(obj1: any, obj2: any): Record<string, any> | null {
    function isObject(value: any): boolean {
        return value && typeof value === 'object' && !Array.isArray(value);
    }

    function diffHelper(o1: any, o2: any): any {
        const diff: Record<string, any> = {};

        const keys = new Set([...Object.keys(o1 || {}), ...Object.keys(o2 || {})]);

        for (const key of keys) {
            const val1 = o1?.[key];
            const val2 = o2?.[key];

            if (Array.isArray(val1) && Array.isArray(val2)) {
                if (val1.length !== val2.length || !val1.every((v, i) => v === val2[i])) {
                    diff[key] = { old: val1, new: val2 };
                }
            } else if (isObject(val1) && isObject(val2)) {
                const nestedDiff = diffHelper(val1, val2);
                if (Object.keys(nestedDiff).length > 0) {
                    diff[key] = nestedDiff;
                }
            } else if (val1 !== val2) {
                diff[key] = { old: val1, new: val2 };
            }
        }

        return diff;
    }

    const result = diffHelper(obj1, obj2);
    return Object.keys(result).length > 0 ? result : null;
}