import { clone } from 'shared/utility/clone';

describe('clone', () => {
  let original;
  
  beforeEach(() => {
    original = {
      doot: 'doot',
      lol: 'wut',
      memes: {
        old: {
          rofl: 'copter',
          ebaumsWorld: {
            techno: 'viking',
          },
        },
        new: {
          aintNobody: 'got time for that',
        },
      },
    };
  });
  
  it('works', () => {
    const cloned = clone(original);
    
    expect(cloned).not.toBe(original);
    expect(cloned).toEqual(original);
  });
});
