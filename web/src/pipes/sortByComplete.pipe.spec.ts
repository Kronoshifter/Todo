import { SortByCompletePipe } from './sortByComplete.pipe';

describe('SortPipe', () => {
  it('create an instance', () => {
    const pipe = new SortByCompletePipe();
    expect(pipe).toBeTruthy();
  });
});
