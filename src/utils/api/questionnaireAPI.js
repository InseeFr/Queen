import Axios from 'axios';
import simpsons from '../fake-survey/simpsons copy.json';

export const getQuestionnaireById = id =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(simpsons), 5000);
  });
