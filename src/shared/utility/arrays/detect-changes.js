import complement from './complement';

const detectChanges = (before = [], after = []) => ({
  added: complement(after, before),
  removed: complement(before, after),
});

export default detectChanges;
