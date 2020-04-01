import Axios from 'axios';

export const getResourceById = id =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve({}), 2000);
  });
