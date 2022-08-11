/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RuntypeBase } from 'runtypes/lib/runtype';

export type PlainObject = Record<string | number | symbol, any>;

class TransformUtils {
  static safeTransform<T extends Record<string, unknown>, U>(
    response: T,
    transform: (data: T) => U,
    check: RuntypeBase['check'],
    nullData: T,
  ) {
    try {
      check(response);
    } catch (e) {
      return transform(TransformUtils.merge(nullData, response));
    }

    return transform(response);
  }

  static merge<T extends Record<string, any>>(origin: T, newComer: T) {
    if (!TransformUtils.isPlainObject(newComer)) return origin;

    const newObject = TransformUtils.isPlainObject(origin)
      ? Object.keys(origin).reduce((carry: Record<string, any>, key) => {
          const targetVal = origin[key];
          if (!Object.keys(newComer).includes(key)) carry[key] = targetVal;
          return carry;
        }, {})
      : {};

    return Object.keys(origin).reduce((carry, key) => {
      const newVal = newComer[key];
      const targetVal = origin[key];

      if (newVal === undefined || newVal === null) {
        carry[key] = Array.isArray(targetVal) ? [] : targetVal;
        return carry;
      }

      if (TransformUtils.isPlainObject(newVal)) {
        carry[key] = TransformUtils.merge(targetVal, newVal);
        return carry;
      }

      if (Array.isArray(newVal)) {
        carry[key] = TransformUtils.mergeArray(targetVal, newVal);
        return carry;
      }

      carry[key] = newVal;
      return carry;
    }, newObject) as T;
  }

  static mergeArray<T extends Record<string, any>>(origin: T[], newComer: T[]) {
    if (!Array.isArray(newComer)) return origin;

    const newObject =
      Array.isArray(origin) && origin.length === 1
        ? Object.keys(origin[0]).reduce((carry: Record<string, any>, key) => {
            const targetVal = origin[0][key];
            if (!Object.keys(newComer).includes(key)) carry[key] = targetVal;
            return carry;
          }, {})
        : [];

    return newComer.map((el) => {
      return Object.keys(origin[0]).reduce((carry, key) => {
        const newVal = el[key];
        const targetVal = origin[0][key];

        if (newVal === undefined || newVal === null) {
          carry[key] = Array.isArray(targetVal) ? [] : targetVal;
          return carry;
        }

        if (TransformUtils.isPlainObject(newVal)) {
          carry[key] = TransformUtils.merge(targetVal, newVal);
          return carry;
        }

        if (Array.isArray(newVal)) {
          carry[key] = TransformUtils.mergeArray(targetVal, newVal);
          return carry;
        }

        carry[key] = newVal;
        return carry;
      }, newObject) as T;
    });
  }

  static isPlainObject(payload: any): payload is PlainObject {
    if (TransformUtils.getType(payload) !== 'Object') return false;
    return payload.constructor === Object && Object.getPrototypeOf(payload) === Object.prototype;
  }

  static getType(payload: any): string {
    return Object.prototype.toString.call(payload).slice(8, -1);
  }

  static flatten(o: string | Record<string, unknown>, prefix = '', result: Record<string, string> = {}) {
    if (typeof o === 'string') {
      result[prefix] = o;
      return result;
    }

    for (const i in o) {
      let pref = prefix;

      if (prefix === '') {
        pref = i;
      } else {
        pref = prefix + '.' + i;
      }

      TransformUtils.flatten(o[i] as string | Record<string, unknown>, pref, result);
    }

    return result;
  }
}

export default TransformUtils;
