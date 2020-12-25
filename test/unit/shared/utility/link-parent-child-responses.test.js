/* eslint-disable camelcase */
import { linkParentChildResponses } from 'shared/utility/link-parent-child-responses';

let responseTimeStamp = 1;
// top level, task response
const a = {
  id: 'a',
  responseTimeStamp: responseTimeStamp++,
};

// followup
const b_ChildOf_A = createChildResponse('b', a);

// followup
const c_ChildOf_A = createChildResponse('c', a);

// top level, task response
const d = {
  id: 'd',
  responseTimeStamp: responseTimeStamp++,
};

// followup
const e_ChildOf_D = createChildResponse('e', d);

// response to followup
const f_ChildOf_E = createChildResponse('f', e_ChildOf_D);

// response to followup
const g_ChildOf_F = createChildResponse('g', f_ChildOf_E);

// response to followup
const h_ChildOf_G = createChildResponse('h', g_ChildOf_F);

describe('linkParentChildResponses()', () => {
  let responseArray;
  let clonedArray;
  let result;
  beforeEach(() => {
    responseArray = shuffle([
      a,
      b_ChildOf_A,
      c_ChildOf_A,
      d,
      e_ChildOf_D,
      f_ChildOf_E,
      g_ChildOf_F,
      h_ChildOf_G,
    ]);
    clonedArray = [...responseArray];
    result = linkParentChildResponses(responseArray);
  });
  
  it('does not modify input objects', () => {
    const result_a = findItemById(result, a.id);
    
    expect(result_a).toBeDefined();
    expect(result_a).not.toBe(a);
    expect(result_a).not.toEqual(a);
    expect(result_a.id).toBe(a.id);
    expect(result_a.responseTimeStamp).toBe(a.responseTimeStamp);
    expect(result_a.responses).toBeDefined();
    expect(a).toEqual({ id: 'a', responseTimeStamp: a.responseTimeStamp, hasResponse: true });
  });
  
  it('does not modify input array', () => {
    expect(clonedArray).toHaveLength(responseArray.length);
    clonedArray.forEach((item, i) => expect(responseArray[i]).toBe(item));
  });
  
  it('correctly maps children up to parents', () => {
    // two root nodes
    expect(result).toHaveLength(2);
    
    const result_a = result[0];
    
    expect(result_a.id).toBe(a.id);
    expect(result_a.responseTimeStamp).toBe(a.responseTimeStamp);
    expect(result_a.responses).toHaveLength(2);
  
    const result_b = result_a.responses[0];
  
    expect(result_b.id).toBe(b_ChildOf_A.id);
    expect(result_b.responses).toHaveLength(0);
  
    const result_c = result_a.responses[1];
    expect(result_c.responses).toHaveLength(0);
  
    expect(result_c.id).toBe(c_ChildOf_A.id);
    
    const result_d = result[1];
    
    expect(result_d.id).toBe(d.id);
    expect(result_d.responseTimeStamp).toBe(d.responseTimeStamp);
    expect(result_d.responses).toHaveLength(1);
  
    const result_e = result_d.responses[0];
    
    expect(result_e.id).toBe(e_ChildOf_D.id);
    expect(result_e.responses).toHaveLength(3);
  
    const result_f = result_e.responses[0];
  
    expect(result_f.id).toBe(f_ChildOf_E.id);
  
    const result_g = result_e.responses[1];
  
    expect(result_g.id).toBe(g_ChildOf_F.id);
  
    const result_h = result_e.responses[2];
  
    expect(result_h.id).toBe(h_ChildOf_G.id);
  });
});

function createChildResponse(id, response) {
  return { id, parentResponseId: response.id, responseTimeStamp: responseTimeStamp++ };
}

function shuffle(arr) {
  for (let i = arr.length; i; i--) {
    const j = Math.floor(Math.random() * i);
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
  return arr;
}

function findItemById(all, id) {
  for (let i = 0; i < all.length; i++) {
    const item = all[i];
    if (item.id === id) {
      return item;
    }
    const found = findItemById(item.responses, id);
    if (found !== null) {
      return found;
    }
  }
  return null;
}
