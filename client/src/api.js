import axios from 'axios';

// * Llamadas al servidor. Puerto y url por defecto definidos en ./js/axiosConfig
// Usuario
export const getUserByUsername = username => {
  return axios.get(`/user/?username=${username}`);
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

// To do's
export const addTodoItems = (boardID, listID, todos) => {
  return axios.post('/boards/todos', {
    boardID,
    listID,
    todos,
  });
};

export const editTodoTitle = (boardID, listID, todoID, title) => {
  return axios.put('/boards/todos/title', {
    boardID,
    listID,
    todoID,
    title,
  });
};
export const editTodoIndex = (boardID, listID, todoID, index) => {
  return axios.put('/boards/todos/index', {
    boardID,
    listID,
    todoID,
    index,
  });
};
export const editTodoDescription = (boardID, listID, todoID, description) => {
  return axios.put('/boards/todos/description', {
    boardID,
    listID,
    todoID,
    description,
  });
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
  return axios.post(`/register`, {
    username,
    password,
  });
};

export const login = (username, password) => {
  return axios.post(
    `/login`,
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
  return axios.get('/logout');
};

export const checkLogin = () => {
  return axios.get('/checkLogin');
};
