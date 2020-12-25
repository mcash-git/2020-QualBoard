export default function flattenResponsesRecursive(response) {
  let children = [response];
  if (response.responses && response.responses.length) {
    response.responses.forEach(r => {
      children = children.concat(flattenResponsesRecursive(r));
    });
  }
  return children;
}
