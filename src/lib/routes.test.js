import { makeLink } from './routes';

describe('makeLink', () => {
  it('works', () => {
    expect(makeLink('/:test123', 'works')).toEqual('/works');
    expect(makeLink('/a/:b/c', 5, 6, 7)).toEqual('/a/5/c');
    expect(makeLink('/something/:Param123/:P456?q=query', 'A', 'B')).toEqual(
      '/something/A/B?q=query'
    );
  });
});
