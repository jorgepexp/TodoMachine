import { getBoardsById } from '@/api/api';

let state = {
  username: '',
  id: '',
  accessToken: '',
  loggedIn: false,
  boards: [],
};

const mutations = {
  changeUserStatus(state) {
    state.loggedIn = !state.loggedIn;
  },
  setUser(state, { username, id, accessToken }) {
    state.username = username;
    state.id = id;
    state.accessToken = accessToken;
  },
  setUserBoards(state, boards) {
    state.boards = [...boards];
  },
  setUserToken(state, token) {
    state.accessToken = token;
  },
  resetUser(state) {
    state.username = '';
    state.id = '';
    // TODO Buscar otra manera más segura de almacenar el token de acceso
    state.accessToken = '';
    state.loggedIn = false;
    state.boards = [];
  },
};

const actions = {
  setUser({ commit }, { username, id, accessToken }) {
    commit('setUser', { username, id, accessToken });
  },
  resetUser({ commit }) {
    commit('resetUser');
  },
  fetchBoards({ commit, state }) {
    if (!state.id) return console.log('User ID no definido');

    getBoardsById(state.id)
      .then(res => {
        if (res.status === 200) {
          // Esto está un poco feo, quizá se podrían devolver los tableros ya ordenados desde el backend
          if (!res.data.boards) {
            commit('setUserBoards', []);
            return;
          }
          res.data.boards.forEach(board => {
            board.todo_lists.forEach(todoList =>
              todoList.todos.sort((a, b) => a.index - b.index)
            );
          });

          commit('setUserBoards', res.data.boards);
        }
      })
      .catch(error => console.error(error));
  },
};

const getters = {
  getBoardByName: state => boardName => {
    return state.boards.find(el => el.name === boardName);
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
