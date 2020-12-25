import { SafeStack } from 'shared/components/safe-stack';

describe('SafeStack', () => {
  describe('constructor', () => {
    it('throws error when "classType" is not undefined and not a ' +
      'function', () => {
      expect(() => new SafeStack('lolwut')).toThrow(/"ClassType"/);
    });

    it('allows initializing without specifying a type', () => {
      const stack = new SafeStack();

      expect(stack).toBeDefined();
    });
  });

  describe('initialized with defined classType', () => {
    class SomeType {

    }

    let stack;
    beforeEach(() => {
      stack = new SafeStack(SomeType);
    });

    describe('push()', () => {
      it('throws error when pushing anything that is not an instance of ' +
        '"SomeType"', () => {
        expect(() => stack.push({ lol: 'wut' })).toThrow(/SomeType/);
      });

      it('succeeds when pushing instance of "SomeType"', () => {
        expect(() => stack.push(new SomeType())).not.toThrow();
      });
    });

    describe('pop()', () => {
      it('returns the expected item', () => {
        const first = new SomeType();
        const second = new SomeType();
        const third = new SomeType();

        stack.push(first);
        stack.push(second);
        stack.push(third);

        expect(stack.current).toBe(third);

        stack.pop();

        expect(stack.current).toBe(second);
      });
    });
  });

  describe('initialized without defined classType', () => {
    let stack;
    beforeEach(() => {
      stack = new SafeStack();
    });

    describe('push()', () => {
      it('allows pushing mixed types', () => {
        expect(() => {
          stack.push('one');
          stack.push(2);
          stack.push({ num: 3 });
        }).not.toThrow();
      });
    });

    describe('pop()', () => {
      it('returns the expected item', () => {
        const first = 1;
        const second = {};
        const third = { lol: 'wut' };
        const fourth = 'maya heee, maya hooo, maya haaa, maya ha ha!';

        stack.push(first);
        stack.push(second);
        stack.push(third);
        stack.push(fourth);

        expect(stack.current).toBe(fourth);

        stack.pop();

        expect(stack.current).toBe(third);
      });
    });
  });
});
