export function linkParentChildResponses(items) {
  // We need two levels of response.  original responses, then all children
  // in the next level.  The second level must contain a link back to its
  // parent.  Each level must be sorted by the timestamp.
  const parentsMap = {};
  let unfound = items.map(i => {
    i.responses = [];
    return i;
  });

  while (unfound.filter(item => item.parentResponseId).length > 0) {
    unfound = unfound.filter(processAndFilter);
  }

  // at this point, everything is linked up
  unfound.sort(compareResponseTimestamps).forEach(topLevelResponse => {
    topLevelResponse.responses.sort(compareResponseTimestamps);
    topLevelResponse.responses.forEach(probe => {
      flattenResponses(probe);
      probe.responses.sort(compareResponseTimestamps);
    });
  });

  return unfound;

  // helper function
  function processAndFilter(item) {
    const parent = parentsMap[item.parentResponseId];
    parentsMap[item.id] = item;

    if (parent) {
      parent.responses.push(item);
      item.parent = parent;
      return false;
    }
    return true;
  }

  function flattenResponses(response) {
    let responses = [];
    response.responses.forEach(r => {
      responses = responses.concat(flattenResponsesRecursive(r));
    });

    response.responses = responses;
  }

  function flattenResponsesRecursive(response) {
    let responses = [response];
    response.responses.forEach(r => {
      responses = responses.concat(flattenResponsesRecursive(r));
    });
    
    return responses;
  }

  function compareResponseTimestamps(a, b) {
    if (a.responseTimeStamp > b.responseTimeStamp) { return 1; }
    if (a.responseTimeStamp < b.responseTimeStamp) { return -1; }
    return 0;
  }
}
