import axios from 'axios';

const serverPort = 9000;

axios.defaults.baseURL = `http://localhost:${serverPort}`;
