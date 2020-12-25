export function linkParentChildResponses(allResponses) {
  const parentsMap = new Map();
  let unmatched = allResponses.map(response => ({
    parent: null,
    children: [],
    response,
  }));

  while (unmatched.some(node => node.response.parentResponseId !== null &&
    node.response.parentResponseId !== undefined)) {
    unmatched = unmatched.filter(node => processAndFilter(node, parentsMap));
  }

  // at this point, everything is linked up
  unmatched.sort(compareResponseTimestamps).forEach(rootNode => {
    rootNode.children.sort(compareResponseTimestamps);
    rootNode.children.forEach(followupNode => {
      flattenResponses(followupNode);
      followupNode.children.sort(compareResponseTimestamps);
    });
  });

  return unmatched.map(rootNode => {
    const { response } = rootNode;
    return {
      ...response,
      responses: rootNode.children.map(node => {
        const followupResponse = node.response;
        followupResponse.responses = node.children.map(child => child.response);
        return followupResponse;
      }),
    };
  });
}

function processAndFilter(node, parentsMap) {
  const parent = parentsMap[node.response.parentResponseId];
  parentsMap[node.response.id] = node;

  if (parent) {
    parent.response.hasResponse = true;
    parent.children.push(node);
    node.parent = parent;
    node.response.parentResponse = parent.response;
    return false;
  }
  return true;
}

function flattenResponses(node) {
  let children = [];
  node.children.forEach(r => {
    children = children.concat(flattenResponsesRecursive(r));
  });

  node.children = children;
}

function flattenResponsesRecursive(response) {
  let children = [response];
  response.children.forEach(r => {
    children = children.concat(flattenResponsesRecursive(r));
  });

  return children;
}

function compareResponseTimestamps(a, b) {
  if (a.response.responseTimeStamp > b.response.responseTimeStamp) { return 1; }
  if (a.response.responseTimeStamp < b.response.responseTimeStamp) { return -1; }
  return 0;
}
