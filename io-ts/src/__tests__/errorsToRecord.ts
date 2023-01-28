import * as t from 'io-ts';
import { isLeft } from 'fp-ts/Either';
import errorsToRecord from '../errorsToRecord';

const assertLeft = <T>(result: t.Validation<T>) => {
  expect(isLeft(result)).toBe(true);
  if (!isLeft(result)) {throw new Error('panic! error is not of the "left" type, should be unreachable');}
  return result.left;
};

describe('errorsToRecord', () => {
  it('should return a correct error for an exact intersection type error object', () => {
    const FIRST_NAME_FIELD_PATH = 'firstName' as const;
    // a recommended pattern from https://github.com/gcanti/io-ts/blob/master/index.md#mixing-required-and-optional-props
    const schema = t.exact(t.intersection([
      t.type({
        [FIRST_NAME_FIELD_PATH]: t.string
      }),
      t.partial({
        lastName: t.string
      })
    ]));
    const error = assertLeft(schema.decode({}));
    const record = errorsToRecord(false)(error);
    expect(record[FIRST_NAME_FIELD_PATH]).toMatchObject({message: 'expected string but got undefined', type: 'string'});
  });
});