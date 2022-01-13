import axios from 'axios';

const serverPort = 9000;

axios.defaults.baseURL = `http://localhost:${serverPort}`;

// TODO
// axios.defaults.headers.common['Authorization'] =
//   'Bearer' + this.$store.status.user.token;
