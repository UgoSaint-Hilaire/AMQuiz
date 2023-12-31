import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const getQuizz = () => axios.get(`quizz`)

export const postUnboxChests = () => axios.post('chests/unbox')