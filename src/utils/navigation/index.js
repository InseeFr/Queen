import React from 'react';

export const NEXT_FOCUS = 'next';
export const PREVIOUS_FOCUS = 'previous';

export const createArrayOfRef = length =>
  Array(length)
    .fill()
    .map(() => React.createRef());

export const createReachableElement = length =>
  Array(length)
    .fill()
    .map(() => true);

export const getNewFocusElementIndex = type => currentIndex => reachableRefs => {
  const newIndex = type === NEXT_FOCUS ? currentIndex + 1 : currentIndex - 1;
  if (newIndex >= reachableRefs.length) return 0;
  if (newIndex < 0) {
    return getNewFocusElementIndex(type)(reachableRefs.length)(reachableRefs);
  } else {
    if (reachableRefs[newIndex]) return newIndex;
    else return getNewFocusElementIndex(type)(newIndex)(reachableRefs);
  }
};
