<template>
  <div
    id="todo-item"
    draggable="true"
    @dragstart="onDragStart"
    @drop.prevent="onDrop"
  >
    <div class="item-container" @click="editItemOverlay = !editItemOverlay">
      <div class="item-content">
        {{ title }}
      </div>
    </div>
    <!-- TODO Se podría trasladar a componente -->
    <v-dialog
      v-model="editItemOverlay"
      max-width="500"
      transition="dialog-bottom-transition"
      :dark="this.$store.state.darkTheme"
    >
      <v-card class="pa-4" min-width="500">
        <v-row align="center" class="pa-3">
          <v-card-title class="pa-0">
            <v-btn
              v-if="!editNameComposer"
              @click="editNameComposer = true"
              class="px-2 mb-1 font-weight-bold text-body-1"
              text
              outlined
            >
              {{ todoTitle }}
            </v-btn>
            <v-text-field
              v-model="todoTitle"
              v-if="editNameComposer"
              @keydown.enter.exact.prevent="editTodoTitle"
              @blur="editTodoTitle"
              class="pa-0 mt-2"
              autofocus
              solo
              outlined
              dense
              single-line
            >
            </v-text-field>
          </v-card-title>
          <v-btn icon class="ml-auto mr-1" @click="editItemOverlay = false">
            <v-icon>
              mdi-window-close
            </v-icon>
          </v-btn>
        </v-row>

        <v-card-subtitle class="">
          en la lista
          <span class="text-decoration-underline">{{ this.$parent.name }}</span>
        </v-card-subtitle>
        <p class="mb-1">Descripción de la tarea</p>
        <v-textarea
          v-model="todoDescription"
          @blur="editTodoDescription"
          placeholder="Descripcion..."
          outlined
          auto-grow
        ></v-textarea>

        <div class="d-flex flex-row-reverse">
          <v-btn class="white--text" color="teal" @click="commitItemChanges">
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
import { patchTodo, deleteTodo, addTodoItems } from '@/api/api';
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
    },
  },
  data() {
    return {
      editItemOverlay: false,
      editNameComposer: false,
      todoTitle: this.title,
      hasTitleChanged: false,
      todoDescription: this.description,
      hasDescriptionChanged: false,
      parentListId: this.$parent.id,
    };
  },
  watch: {
    todoDescription() {
      this.hasDescriptionChanged = true;
    },
    todoTitle() {
      this.hasTitleChanged = true;
    },
  },
  computed: {
    boardID() {
      return this.$store.getters.getBoardByName(this.$parent.$parent.name)._id;
    },
  },
  methods: {
    deleteTodo() {
      deleteTodo(this.boardID, this.parentListId, this.id).then(response => {
        if (response.status === 200) {
          this.editItemOverlay = false;
          this.$store.dispatch('fetchBoards');
          return;
        }
        console.error(response);
      });
    },
    async editTodoTitle() {
      this.editNameComposer = false;
      if (this.hasTitleChanged) {
        await patchTodo(this.boardID, this.parentListId, this.id, {
          title: this.todoTitle,
        }).then(response => {
          if (response.status === 200) this.$store.dispatch('fetchBoards');
        });
      }
      this.hasTitleChanged = false;
    },
    commitItemChanges() {
      this.editTodoDescription();
      this.editItemOverlay = false;
    },
    async editTodoDescription() {
      if (this.todoDescription && this.hasDescriptionChanged) {
        this.hasDescriptionChanged = false;
        await patchTodo(this.boardID, this.parentListId, this.id, {
          description: this.todoDescription,
        })
          .then(response => {
            if (response.status === 200) this.$store.dispatch('fetchBoards');
          })
          .catch(error => console.error(error));
      }
      this.hasDescriptionChanged = false;
    },
    onDragStart(ev) {
      ev.dataTransfer.setData(
        'todo-data',
        JSON.stringify({
          index: this.index,
          id: this.id,
          parentID: this.parentListId,
          title: this.title,
          description: this.description,
        })
      );
      ev.dataTransfer.dropEffect = 'move';
      ev.dataTransfer.effectAllowed = 'move';
    },
    async onDrop(ev) {
      // Evitamos error en caso de que se dropee otro elemento en la zona
      if (!ev.dataTransfer.getData('todo-data')) return;

      const dropZoneID = this.parentListId;
      const {
        index: draggedItemIndex,
        id: draggedItemID,
        parentID: draggedItemParentID,
        title: draggedItemTitle,
        description: draggedItemDescription,
      } = JSON.parse(ev.dataTransfer.getData('todo-data'));

      const isSameItem = this.id == draggedItemID;
      const isSameDropzone = dropZoneID == draggedItemParentID;
      if (isSameItem && isSameDropzone) return;

      // Al moverlo a diferente lista se inserta en última posición
      if (dropZoneID != draggedItemParentID) {
        const todoItem = {
          title: draggedItemTitle,
          id: this.$parent.autoIncrementID(),
          index: this.$parent.autoIncrementIndex(),
          description: draggedItemDescription,
        };

        await addTodoItems(this.boardID, parseInt(dropZoneID), [
          todoItem,
        ]).catch(error => console.error(error));

        await deleteTodo(
          this.boardID,
          parseInt(draggedItemParentID),
          parseInt(draggedItemID)
        ).catch(error => console.error(error));

        this.$store.dispatch('fetchBoards');
        return;
      }

      const firstRequest = patchTodo(
        this.boardID,
        dropZoneID,
        parseInt(draggedItemID),
        { index: this.index }
      );

      const secondRequest = patchTodo(this.boardID, dropZoneID, this.id, {
        index: parseInt(draggedItemIndex),
      });

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

  .v-text-field .v-input__control .v-input__slot {
    min-height: auto !important;
    display: flex !important;
    align-items: center !important;
  }

  .edit-item-overlay {
    background-color: var(--surface1) !important;
  }
}
</style>
