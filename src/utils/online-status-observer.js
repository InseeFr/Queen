import { QUEEN_URL } from './constants';

// every 30 sec
const INTERVAL_CHECK_ONLINE_STATUS = 30 * 1000;
const ONLINE = 'online';
const OFFLINE = 'offline';
const observers = [];

export const checkOnlineStatus = async () => {
  try {
    const online = await fetch(`${QUEEN_URL}/online.json`);
    const responseStatus = online.status >= 200 && online.status < 300;
    if (responseStatus) {
      // check if is really the exepected json file (not a fallback to index.html)
      const data = await online?.json();
      return data?.online === 'true';
    }
    return false;
  } catch (err) {
    // Something went wrong
    return false; // definitely offline
  }
};

const online = async () => {
  const result = await checkOnlineStatus();
  observers.forEach(o => {
    o(result);
  });
};
const offline = () => {
  observers.forEach(o => {
    o(false);
  });
};

const initNavigatorListener = () => {
  window.addEventListener(ONLINE, online);
  window.addEventListener(OFFLINE, offline);
};

const initOnlineFetch = () => {
  return setInterval(async () => {
    const result = await checkOnlineStatus();
    if (result) online();
    else offline();
  }, INTERVAL_CHECK_ONLINE_STATUS);
};

export const clean = () => {
  if (initNavigatorListener) {
    window.removeEventListener(ONLINE, online);
    window.removeEventListener(OFFLINE, offline);
  }
};

let isInit = false;

const observer = o => {
  if (!isInit) {
    isInit = true;
    initNavigatorListener();
    initOnlineFetch();
  }
  if (typeof o === 'function') {
    observers.push(o);
    (async () => {
      const online = navigator.onLine && (await checkOnlineStatus());
      o(online);
    })();
  }
};
export default observer;
