import { findPageIndex, getPreviousPage, getNextPage } from './pages';

const components = [{ page: 1 }, { page: 10 }, { page: 11 }];

describe('pages utils', () => {
  describe('find page index', () => {
    it('should return component index', () => {
      expect(findPageIndex()()).toEqual(-1);
      expect(findPageIndex(components)(1)).toEqual(0);
      expect(findPageIndex(components)(10)).toEqual(1);
      expect(findPageIndex(components)(11)).toEqual(2);
    });
  });

  describe('go previous', () => {
    it('should return 1', () => {
      expect(getPreviousPage()()).toEqual(1);
      expect(getPreviousPage(components)(1)).toEqual(1);
    });
    it('should return previous page', () => {
      expect(getPreviousPage(components)(10)).toEqual(1);
      expect(getPreviousPage(components)(11)).toEqual(10);
    });
  });

  describe('go next', () => {
    it('should return 11', () => {
      expect(getNextPage()()).toEqual(1);
      expect(getNextPage(components)(11)).toEqual(11);
      expect(getNextPage(components)(2)).toEqual(11);
    });
    it('should return next page', () => {
      expect(getNextPage(components)(1)).toEqual(10);
      expect(getNextPage(components)(10)).toEqual(11);
    });
  });
});
