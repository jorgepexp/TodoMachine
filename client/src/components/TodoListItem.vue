<template>
  <div
    id="todo-item"
    draggable="true"
    @dragstart="onDragStart"
    @drop.prevent="onDrop"
  >
    <!-- 
      @dragover.stop
      @dragstart="dragStart($event)" -->
    <div
      ref="itemContainer"
      class="item-container"
      @click="editItemOverlay = !editItemOverlay"
    >
      <div class="item-content">
        {{ title }}
      </div>
    </div>
    <!-- TODO Añadir botón de cerrar -->
    <!-- TODO Poder editar título de la tarea -->
    <!-- TODO Poder añadir descripción de la tarea -->
    <v-dialog
      v-model="editItemOverlay"
      max-width="500"
      transition="dialog-bottom-transition"
    >
      <v-card class="mx-auto px-4 py-4" min-width="500">
        <v-card-title class="px-0 py-0">
          <span class="text-h5 font-weight-bold">{{ title }}</span>
        </v-card-title>
        <div class="text-subtitle-1">
          en la lista
          <span class="text-decoration-underline">{{ this.$parent.name }}</span>
        </div>
        <v-textarea
          clearable
          clear-icon="mdi-close-circle"
          label="Descripción de la tarea..."
        ></v-textarea>

        <div class="d-flex flex-row-reverse">
          <v-btn
            class="white--text"
            color="teal"
            @click="editItemOverlay = false"
          >
            Hecho
          </v-btn>
          <v-btn class="white--text" color="error" plain @click="deleteTodo">
            Eliminar tarea
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { editTodo, deleteTodo, addTodoItems } from '@/api.js';
export default {
  name: 'TodoItem',
  props: {
    id: {
      type: Number,
      required: true,
    },
    todo: {
      type: Object,
      required: true,
    },
    title: {
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
      itemContainer: [],
      editItemOverlay: false,
      zIndex: 100,
    };
  },
  computed: {
    boardID() {
      return this.$store.getters.getBoardByName(this.$parent.$parent.id)._id;
    },
  },
  methods: {
    deleteTodo() {
      deleteTodo(this.boardID, this.$parent.id, this.id).then(response => {
        if (response.status === 200 && !response.error) {
          this.editItemOverlay = false;
          this.$store.dispatch('fetchBoards');
          return;
        }
        console.error(response);
      });
    },
    onDragStart(ev) {
      ev.dataTransfer.setData(
        'todo-data',
        JSON.stringify({
          index: this.index,
          id: this.id,
          parentID: this.$parent.id,
          title: this.title,
        })
      );
      ev.dataTransfer.dropEffect = 'move';
      ev.dataTransfer.effectAllowed = 'move';
    },
    async onDrop(ev) {
      const draggedItemData = JSON.parse(ev.dataTransfer.getData('todo-data'));
      const dropZoneID = this.$parent.id;

      // Si el ID es el mismo es que han dropeado la tarea en su misma posición
      if (
        this.id == draggedItemData.id &&
        dropZoneID == draggedItemData.parentID
      ) {
        return;
      }

      // Al moverlo a diferente lista se inserta en última posición
      if (dropZoneID != draggedItemData.parentID) {
        const todoItem = {
          title: draggedItemData.title,
          id: this.$parent.autoIncrementID(),
          index: this.$parent.autoIncrementIndex(),
        };

        await addTodoItems(this.boardID, parseInt(dropZoneID), [
          todoItem,
        ]).catch(error => console.error(error));

        await deleteTodo(
          this.boardID,
          parseInt(draggedItemData.parentID),
          parseInt(draggedItemData.id)
        ).catch(error => console.error(error));

        await this.$store.dispatch('fetchBoards');
        return;
      }

      let firstRequest = editTodo(
        this.boardID,
        dropZoneID,
        parseInt(draggedItemData.id),
        this.index
      );

      let secondRequest = editTodo(
        this.boardID,
        dropZoneID,
        this.id,
        parseInt(draggedItemData.index)
      );

      await Promise.all([firstRequest, secondRequest]).catch(error =>
        console.error(error)
      );
      this.$store.dispatch('fetchBoards');
    },
  },
};
</script>

<style lang="scss">
#todo-item {
  .item-container {
    margin-bottom: 8px;
  }

  .item-content {
    position: relative;

    background: $--bg-color-light;
    border-bottom: 1px solid lightgrey;
    border-radius: 3px;

    overflow: hidden;
    cursor: pointer;

    padding: 6px 8px 4px;

    &:hover {
      background-color: $--hover-bg-light;
    }
  }
}
</style>
