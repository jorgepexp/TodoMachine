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
    <!-- TODO Se podría trasladar a componente -->
    <v-dialog
      v-model="editItemOverlay"
      max-width="500"
      transition="dialog-bottom-transition"
    >
      <v-card class="px-4 py-4" min-width="500">
        <v-row class="d-flex align-center">
          <v-card-title class="px-3 pb-2 pt-2">
            <span
              v-if="!editNameComposer"
              @click="editNameComposer = true"
              class="text-h5 font-weight-bold pb-1"
              >{{ todoTitle }}</span
            >
            <!-- TODO Estilos -->
            <v-row no-gutters>
              <v-col md="12">
                <v-text-field
                  v-if="editNameComposer"
                  v-model="todoTitle"
                  @keydown.enter.exact.prevent="editTodoTitle"
                  outlined
                  dense
                  class="ma-0 pa-0"
                  autofocus
                  background-color="white"
                >
                </v-text-field>
                <!-- @blur="editTodoTitle" -->
              </v-col>
            </v-row>
          </v-card-title>
          <v-btn icon class="ml-auto mr-1" @click="editItemOverlay = false">
            <v-icon>
              mdi-window-close
            </v-icon>
          </v-btn>
        </v-row>

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
import {
  editTodoTitle,
  editTodoIndex,
  // editTodoDescription,
  deleteTodo,
  addTodoItems,
} from '@/api.js';
export default {
  name: 'TodoItem',
  //? Datos de la lista padre
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
    description: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      itemContainer: [],
      editItemOverlay: false,
      zIndex: 100,
      editNameComposer: false,
      todoTitle: this.title,
      parentListId: this.$parent.id,
    };
  },
  computed: {
    boardID() {
      return this.$store.getters.getBoardByName(this.$parent.$parent.id)._id;
    },
  },
  methods: {
    deleteTodo() {
      deleteTodo(this.boardID, this.parentListId, this.id).then(response => {
        if (response.status === 200 && !response.error) {
          this.editItemOverlay = false;
          this.$store.dispatch('fetchBoards');
          return;
        }
        console.error(response);
      });
    },
    async editTodoTitle() {
      this.editNameComposer = false;
      await editTodoTitle(
        this.boardID,
        this.parentListId,
        this.id,
        this.todoTitle
      );
      this.$store.dispatch('fetchBoards');
    },
    editTodoDescription() {
      this.editNameComposer = false;
      editTodoTitle(this.boardID, this.parentListId, this.id, this.description);
      console.log('Se ha intentado editar la descripción de la tarea');
    },
    onDragStart(ev) {
      ev.dataTransfer.setData(
        'todo-data',
        JSON.stringify({
          index: this.index,
          id: this.id,
          parentID: this.parentListId,
          title: this.title,
        })
      );
      ev.dataTransfer.dropEffect = 'move';
      ev.dataTransfer.effectAllowed = 'move';
    },
    async onDrop(ev) {
      const draggedItemData = JSON.parse(ev.dataTransfer.getData('todo-data'));
      const dropZoneID = this.parentListId;

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

      let firstRequest = editTodoIndex(
        this.boardID,
        dropZoneID,
        parseInt(draggedItemData.id),
        this.index
      );

      let secondRequest = editTodoIndex(
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
