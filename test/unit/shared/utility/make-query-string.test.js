import { makeQueryString } from 'shared/utility/make-query-string';

describe('makeQueryString', () => {
  test('simple query', () => {
    const qs = makeQueryString({
      a: 'testA',
      c: 'testC',
      b: 'testB',
    });

    expect(qs).toBe('?a=testA&b=testB&c=testC');
  });

  test('query with special characters', () => {
    const qs = makeQueryString({
      a: 'test test testing',
    });

    expect(qs).toBe('?a=test%20test%20testing');
  });

  test('query with array', () => {
    const qs = makeQueryString({
      a: ['test3', 'test2', 'test1'],
    });

    expect(qs).toBe('?a=test3&a=test2&a=test1');
  });

  test('query with all sorts of stuff happening', () => {
    const qs = makeQueryString({
      a: 'testA',
      q: 'test test testing',
      c: ['test3', 'test2', 'test1'],
    });

    expect(qs).toBe('?a=testA&c=test3&c=test2&c=test1&q=test%20test%20testing');
  });
});
