export function assertClassType(instance, type) {
  if (instance.constructor.name !== type.name) {
    throw new TypeError(`expected: "${type.name}", actual: "${
      instance.constructor.name}"`);
  }
}
