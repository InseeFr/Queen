const ONLINE = 'online';
const OFFLINE = 'offline';
const observers = [];

const online = () => {
  observers.forEach(o => {
    o(true);
  });
};
const offline = () => {
  observers.forEach(o => {
    o(false);
  });
};

const init = () => {
  window.addEventListener(ONLINE, online);
  window.addEventListener(OFFLINE, offline);
};

export const clean = () => {
  if (init) {
    window.removeEventListener(ONLINE, online);
    window.removeEventListener(OFFLINE, offline);
  }
};

let isInit = false;

const observer = o => {
  if (!isInit) {
    isInit = true;
    init();
  }
  if (typeof o === 'function') {
    observers.push(o);
    o(navigator.onLine);
  }
};
export default observer;
