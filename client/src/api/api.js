import axios from 'axios';

// * Llamadas al servidor. Puerto y url por defecto definidos en ./js/axiosConfig
// Usuario
export const getUserByUsername = username => {
  return axios.get(`/user/?username=${username}`);
};

export const patchUser = (filters, document) => {
  return axios.patch(`/user`, {
    filters,
    document,
  });
};

// Tablones
export const getBoardsById = ownerID => {
  return axios.get(`/boards/${ownerID}`);
};

export const postBoard = (ownerID, name) => {
  return axios.post('/boards', {
    ownerID,
    name,
  });
};

export const patchBoard = (boardID, name) => {
  return axios.patch('/boards', {
    boardID,
    name,
  });
};

export const deleteBoard = boardID => {
  return axios.delete('/boards', {
    data: {
      boardID,
    },
  });
};

// Listas
export const postTodoList = (boardID, listID, name, index, todos) => {
  return axios.post('/boards/list', {
    boardID,
    listID,
    name,
    index,
    todos,
  });
};

export const editList = (boardID, listID, index, name) => {
  return axios.put(`/boards/list`, {
    boardID,
    listID,
    index,
    name,
  });
};

export const deleteList = (boardID, listID) => {
  return axios.delete(`/boards/list`, {
    data: {
      boardID,
      listID,
    },
  });
};

// To Do's
export const addTodoItems = (boardID, listID, todos) => {
  return axios.post('/boards/todos', {
    boardID,
    listID,
    todos,
  });
};

export const patchTodo = (boardID, listID, todoID, document) => {
  return axios.patch(
    '/boards/todos/',
    {
      boardID,
      listID,
      todoID,
      document,
    },
    { withCredentials: true }
  );
};

export const deleteTodo = (boardID, listID, todoID) => {
  return axios.delete('/boards/todos', {
    data: {
      boardID,
      listID,
      todoID,
    },
  });
};

// Control de usuarios
export const register = async (username, password) => {
  return axios.post(`/user/register`, {
    username,
    password,
  });
};

export const login = (username, password) => {
  return axios.post(
    `/user/login`,
    {
      username,
      password,
    },
    {
      withCredentials: true,
    }
  );
};

export const logout = () => {
  axios.defaults.headers.common['Authorization'] = '';
  return axios.get('/user/logout', {
    withCredentials: true,
  });
};

// // Auth
// export const refreshToken = () => {
//   return axios.get('/auth/refresh');
// };
