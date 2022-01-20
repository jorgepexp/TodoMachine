<template>
  <div class="board-container" @dragover.prevent @dragenter.prevent>
    <todo-list
      v-for="list in getListById"
      :todos="list.todos"
      :name="list.name"
      :id="list.id"
      :index="list.index"
      :key="list.id"
    >
      <todo-item
        v-for="item in list.todos"
        :todo="item"
        :title="item.title"
        :id="item.id"
        :index="item.index"
        :key="item.id"
      >
        {{ item.title }}
      </todo-item>
    </todo-list>

    <v-form
      v-if="showTodoListComposer"
      ref="addNewListForm"
      v-model="valid"
      class="add-todo-list-controls"
      @submit.prevent="addTodoList(newListTitle)"
    >
      <v-text-field
        v-model="newListTitle"
        class="new-list-title"
        :dark="this.$store.state.darkTheme"
        :rules="titleRules"
        :counter="30"
        autofocus
        outlined
        label="Título de la lista"
      ></v-text-field>

      <!-- TODO Conseguir que @blur funcione -->
      <div>
        <v-btn
          type="submit"
          class="text-capitalize add-list-btn"
          color="#1976D2"
          >Añadir lista</v-btn
        >
        <v-icon class="close-btn" @click="showTodoListComposer = false"
          >mdi-close</v-icon
        >
      </div>
    </v-form>

    <div v-if="!showTodoListComposer" class="add-todo-list">
      <v-btn @click="showTodoListComposer = true"
        >+ Añadir {{ !getListById.length ? 'nueva' : 'otra' }} lista</v-btn
      >
    </div>
  </div>
</template>

<script>
import TodoList from '../components/TodoList.vue';
import TodoItem from '../components/TodoListItem.vue';
import * as api from '@/api.js';

export default {
  name: 'UserBoardView',
  components: {
    TodoList,
    TodoItem,
  },
  props: {
    // Actualmente ID es una string (nombre del tablero)
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      todoLists: [],
      newListTitle: '',
      showTodoListComposer: false,
      valid: true,
      titleRules: [v => !!v, v => v.length <= 30],
    };
  },
  computed: {
    getListById() {
      let board = this.$store.state.user.boards.find(
        board => board.name === this.id
      );
      // Devolvemos el tablero ordenado por índice
      return board ? board.todo_lists.sort((a, b) => a.index - b.index) : [];
    },
  },
  methods: {
    prueba(ev) {
      console.log('Funciona blur');
      console.log(ev);
    },
    async addTodoList(title) {
      if (!this.$refs.addNewListForm.validate()) {
        return;
      }

      let boardID = this.$store.getters.getBoardByName(this.id)._id;

      await api
        .postTodoList(
          boardID,
          this.autoIncrementID(),
          title,
          this.autoIncrementIndex()
        )
        .then(response => {
          if (response.status === 400) {
            return console.log(response.data);
          }
          if (response.status === 201) {
            this.$store.dispatch('fetchBoards');
            console.log(response.data.message);
          }
        });

      this.showTodoListComposer = false;
      this.newListTitle = '';
    },
    autoIncrementID() {
      const maxID =
        this.getListById.length === 0
          ? 0
          : this.getListById.reduce((prev, curr) =>
              prev.id > curr.id ? prev : curr
            ).id + 1;

      return maxID;
    },
    autoIncrementIndex() {
      const maxIndex =
        this.getListById.length === 0
          ? 0
          : this.getListById[this.getListById.length - 1].index + 1;

      return maxIndex;
    },
  },
};
</script>

<style lang="scss" scoped>
//Contenedor principal del tablero
.board-container {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;

  height: 90vh;
  width: auto;
  background: var(--surface1);
  overflow-x: scroll;

  padding: 2rem;

  .v-form {
    min-width: 250px;

    .v-input {
      height: 70px;
    }

    .add-list-btn {
      color: var(--text1-dark);
    }
  }

  .add-todo-list .v-btn {
    background: var(--surface2);
    color: var(--text1);
  }

  .new-list-title {
    input {
      color: red;
    }
  }

  .close-btn {
    font-size: 28px;

    cursor: pointer;
    margin-left: 6px;

    &:hover {
      color: var(--text2);
    }
  }
}
</style>
