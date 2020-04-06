import Axios from 'axios';
import data from '../fake-survey/data.json';

export const getDataSurveyUnitById = id =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(data), 1000);
  });

export const getCommentSurveyUnitById = id =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve({}), 500);
  });
