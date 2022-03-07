import { getBoardsById } from '@/api.js';

let state = {
  username: '',
  id: '',

  loggedIn: false,
  profilePic: null,
  boards: [],
};

const mutations = {
  changeUserStatus(state) {
    state.loggedIn = !state.loggedIn;
  },
  setUser(state, { username, id }) {
    state.username = username;

    state.id = id;
  },
  setUserBoards(state, boards) {
    state.boards = [...boards];
  },
  setUserProfilePicture(state, { profilePic }) {
    state.profilePic = profilePic;
  },
  resetUser(state) {
    state.username = '';
    state.id = '';

    state.loggedIn = false;
    state.profilePic = null;
    state.boards = [];
  },
};

const actions = {
  setUser({ commit }, { username, id }) {
    commit('setUser', { username, id });
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
