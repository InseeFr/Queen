import Axios from 'axios';
import simpsons from '../fake-survey/simpsons copy.json';

export const getQuestionnaireById = (urlQueenApi, id, token) => {
  const secureHeader = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : null;

  return new Promise((resolve, reject) => {
    /*
    Axios.get(`${urlQueenApi}/${id}`, {
      headers: {
        ...secureHeader,
        Accept: 'application/json;charset=utf-8',
      },
    })
      .then(res => resolve(res))
      .catch(e => console.log('get error !! '));
*/
    setTimeout(() => resolve(simpsons), 1500);
  });
};
