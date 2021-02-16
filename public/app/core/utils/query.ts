import _ from 'lodash';
import { DataQuery } from '@grafana/data';

const lettersToNumber = (letters: string): number =>
  letters.split('').reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0) - 1;

const numberToLetters = (number: number): string => {
  let result = '';
  do {
    result = ((number % 26) + 10).toString(36) + result;
    number = Math.floor(number / 26) - 1;
  } while (number >= 0);
  return result.toUpperCase();
};

export const getNextRefIdChar = (queries: DataQuery[]): string => {
  if (queries.length === 0) {
    return 'A';
  }
  return numberToLetters(lettersToNumber(_.last(queries)?.refId ?? '') + 1);
};

export function addQuery(queries: DataQuery[], query?: Partial<DataQuery>): DataQuery[] {
  const q = query || {};
  q.refId = getNextRefIdChar(queries);
  q.hide = false;
  return [...queries, q as DataQuery];
}

export function isDataQuery(url: string): boolean {
  if (
    url.indexOf('api/datasources/proxy') !== -1 ||
    url.indexOf('api/tsdb/query') !== -1 ||
    url.indexOf('api/ds/query') !== -1
  ) {
    return true;
  }

  return false;
}

export function isLocalUrl(url: string) {
  return !url.match(/^http/);
}
