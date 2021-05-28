export { default as addOnlineStatusObserver } from './online-status-observer';
export const getPercent = (n, length) => Math.round((100 * n) / length);

export const goToTopPage = topRef => {
  if (topRef && topRef.current) {
    topRef.current.tabIndex = -1;
    topRef.current.focus();
    topRef.current.blur();
    window.scrollTo({ top: 0 });
    topRef.current.removeAttribute('tabindex');
  }
};
