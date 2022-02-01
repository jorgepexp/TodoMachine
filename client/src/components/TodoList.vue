<template>
  <div id="todo-list-container">
    <div
      class="list-header"
      :draggable="!editNameComposer"
      @dragstart="onDragStart"
      @drop.prevent="onDrop"
      @click="editNameComposer = true"
    >
      <div class="task-name">
        <p v-if="!editNameComposer" class="mb-0">{{ listName }}</p>
        <!-- TODO Bg color estático. Cambiar -->
        <v-textarea
          v-if="editNameComposer"
          class="edit-name-composer"
          v-model="listName"
          @keydown.enter.exact.prevent="editListName"
          @blur="editListName"
          autofocus
          auto-grow
          outlined
          dense
          rows="1"
          :placeholder="listName"
          background-color="white"
        ></v-textarea>
      </div>

      <div class="list-header-extras">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2 ht-4"
              x-small
              color="blue darken-2"
              dark
              elevation="2"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon> mdi-dots-horizontal </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="deleteList">
              <v-list-item-title>Borrar lista</v-list-item-title>
            </v-list-item>

            <v-list-item @click="transferList">
              <v-list-item-title>Mover lista</v-list-item-title>
            </v-list-item>

            <ListOwnerChangeOverlay
              :listId="id"
              :boardId="boardID"
              :name="name"
              :index="index"
              :todos="todos"
            />
          </v-list>
        </v-menu>
      </div>
    </div>
    <!-- Slot para los TodoItem -->
    <slot></slot>

    <v-btn
      @click="hideAddTodoComposer = false"
      plain
      class="add-item-button text-capitalize"
      v-show="hideAddTodoComposer"
    >
      + Añada una tarea
    </v-btn>

    <div class="item-composer" v-show="!hideAddTodoComposer">
      <!-- // TODO No funciona autofocus -->
      <textarea
        autofocus
        placeholder="Introduzca un título para esta tarea..."
        v-model="newItemTitle"
        @keydown.enter.exact.prevent="addNewItem()"
      ></textarea>
      <div class="new-item-options">
        <v-btn @click="addNewItem()" small color="primary">Añadir tarea</v-btn>
        <button @click="hideAddTodoComposer = true">
          <v-icon class="close-btn">mdi-close</v-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { addTodoItems, deleteList, editList, postTodoList } from '@/api.js';
import ListOwnerChangeOverlay from './ListOwnerChangeOverlay.vue';
export default {
  name: 'TodoList',
  components: {
    ListOwnerChangeOverlay,
  },
  props: {
    todos: {
      type: Array,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editNameComposer: false,
      newItemTitle: '',
      hideAddTodoComposer: true,

      listName: this.name,
      hasListNameChanged: false,
      changeOwnerOverlay: false,
    };
  },
  computed: {
    boardID() {
      return this.$store.getters.getBoardByName(this.$parent.name)._id;
    },
  },
  watch: {
    listName() {
      this.hasListNameChanged = true;
    },
  },
  methods: {
    async addNewItem() {
      if (typeof this.newItemTitle === 'undefined' || this.newItemTitle === '')
        return;

      const todoItem = {
        title: this.newItemTitle.trim(),
        id: this.autoIncrementID(),
        index: this.autoIncrementIndex(),
        description: '',
      };

      await addTodoItems(this.boardID, this.id, [todoItem])
        .then(response => {
          if (response.status === 400) {
            return console.log('No se ha podido añadir todo a la lista');
          }
          if (response.status === 201) {
            this.$store.dispatch('fetchBoards');
          }
        })
        .catch(error => {
          console.error(error.message, error);
        });

      this.newItemTitle = '';
    },
    deleteList() {
      deleteList(this.boardID, this.id)
        .then(response => {
          if (response.status === 400) {
            console.error(response.error);
            return;
          }
          if (response.status === 200) {
            this.$store.dispatch('fetchBoards');
          }
        })
        .catch(error => console.error(error));
    },
    editListName() {
      this.editNameComposer = false;
      if (this.hasListNameChanged) {
        this.hasListNameChanged = false;
        editList(this.boardID, this.id, undefined, this.listName.trim())
          .then(response => {
            if (response.status === 400) {
              return console.log('No se ha podido editar la lista');
            }
            if (response.status === 201) {
              this.$store.dispatch('fetchBoards');
            }
          })
          .catch(error => console.error(error.message));
      }
      this.hasListNameChanged = false;
    },
    // TODO Esto
    async transferList() {
      await postTodoList(
        this.selectedBoardId,
        this.listId,
        this.name,
        this.index,
        this.todos
      )
        .then(response => console.log(response))
        .catch(error => console.log(error));

      await deleteList(this.boardId, this.listId)
        .then(response => console.log(response))
        .catch(error => console.log(error));
    },
    onDragStart(ev) {
      ev.dataTransfer.setData(
        'list-data',
        JSON.stringify({
          index: this.index,
          id: this.id,
        })
      );
      ev.dataTransfer.dropEffect = 'move';
      ev.dataTransfer.effectAllowed = 'move';
    },
    async onDrop(ev) {
      if (!ev.dataTransfer.getData('list-data')) return;

      const { listIndex, listID } = JSON.parse(
        ev.dataTransfer.getData('list-data')
      );

      const isSameList = this.id == listID;
      if (isSameList) return;

      let firstRequest = editList(this.boardID, parseInt(listID), this.index);
      let secondRequest = editList(this.boardID, this.id, parseInt(listIndex));

      await Promise.all([firstRequest, secondRequest]).catch(error =>
        console.error(error)
      );
      this.$store.dispatch('fetchBoards');
    },
    autoIncrementID() {
      let maxID =
        this.todos.length === 0
          ? 0
          : this.todos.reduce((prev, curr) => (prev.id > curr.id ? prev : curr))
              .id + 1;
      return maxID;
    },
    autoIncrementIndex() {
      const maxIndex =
        this.todos.length === 0
          ? 0
          : this.todos[this.todos.length - 1].index + 1;

      return maxIndex;
    },
  },
};
</script>

<style lang="scss">
//Contenedor principal de cada lista de tareas
#todo-list-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;

  width: $--todo-container-width;
  min-height: $--todo-container-height;

  background: var(--surface2);
  border-radius: $--todo-border-radius;

  margin: 0 0.5rem;
  padding: 0 10px;

  .list-header {
    display: flex;
    padding: 10px 8px;

    .task-name {
      min-height: 20px;

      color: var(--text1);
      font-weight: 500;
      overflow: hidden;
      overflow-wrap: break-word;

      margin-right: auto;
      padding: 4px 6px;
    }

    .list-header-extras {
      max-height: 25px;
      padding-top: 4px;
    }

    &:hover {
      cursor: pointer;
    }
  }

  .item-composer {
    margin-bottom: 1rem;

    textarea {
      height: 80px;
      width: 250px;

      background: var(--surface1);
      border-radius: 3px;

      color: var(--text1);
      font-size: 15px;
      font-weight: 300;
      overflow: hidden;
      overflow-wrap: break-word;

      resize: none;
      outline: none;

      margin-top: 10px;
      padding: 5px;
    }
  }

  .new-item-options {
    display: flex;

    margin-top: 10px;

    .close-btn {
      padding-left: 5px;
      color: var(--text2);
      &:hover {
        color: var(--text1);
      }
    }
  }

  .add-item-button {
    margin-top: 5px;
    margin-bottom: 1rem;

    &:hover {
      // background: darken($--todo-bg-color, 6);
      background: var(--surface4);
    }

    .v-btn__content {
      justify-content: flex-start;
      color: var(--text1);
    }
  }
}
</style>
