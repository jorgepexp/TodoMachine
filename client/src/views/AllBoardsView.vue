<template>
  <div id="all-boards-view">
    <v-list nav class="home-left-sidebar-container mt-10">
      <v-list-item-group v-model="selectedItem">
        <v-list-item
          v-for="(item, i) in leftMenuItems"
          :key="i"
          class="left-sidebar-item"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list class="all-boards mt-10">
      <v-list-item-title class="title">
        Tus tableros favoritos
        <span aria-hidden="true">🌟</span></v-list-item-title
      >
      <div class="separator" aria-hidden="true"></div>
      <div v-if="favoriteBoards.length" class="favorite-boards">
        <div class="boards-container">
          <div v-for="board in favoriteBoards" :key="board._id">
            <router-link
              :to="{
                name: 'board',
                params: {
                  username: $store.state.user.username,
                  name: board.name,
                },
              }"
              class="teal darken-4 white--text"
            >
              <span>{{ board.name }}</span>
            </router-link>
          </div>
        </div>
      </div>
      <p v-else class="no-favorites-msg">
        Ningún tablero añadido a favoritos.
      </p>

      <v-list-item-title class="title">
        Todos tus tableros <span aria-hidden="true">✔️</span></v-list-item-title
      >
      <div class="separator" aria-hidden="true"></div>
      <div v-if="userBoards.length" class="available-boards">
        <div class="boards-container">
          <div v-for="board in userBoards" :key="board._id">
            <router-link
              :to="{
                name: 'board',
                params: {
                  username: $store.state.user.username,
                  name: board.name,
                },
              }"
              class="blue accent-3 white--text"
            >
              <span>{{ board.name }}</span>
            </router-link>
          </div>
        </div>
      </div>
      <p v-else class="no-boards-msg">
        No existe ningún tablero creado actualmente.
      </p>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'AllBoardsView',
  components: {},
  data() {
    return {
      selectedItem: 0,
      //TODO Añadir funcionalidad a cada uno de los botones
      //TODO Dark theme no funciona del todo bien
      // ? Cada objeto tendrá una referencia a una función
      leftMenuItems: [
        {
          icon: 'mdi-bulletin-board',
          text: 'Tableros',
        },
        {
          icon: 'mdi-star',
          text: 'Favoritos',
        },
      ],
    };
  },
  computed: {
    userBoards() {
      return this.$store.state.user.boards;
    },
    favoriteBoards() {
      if (this.$store.state.user.boards.length) {
        return this.$store.state.user.boards.filter(
          board => board.favorite === true
        );
      }
      return [];
    },
  },
};
</script>

<style lang="scss">
#all-boards-view {
  display: grid;
  grid-template-columns: 30% 1fr;

  min-height: 100%;

  background: var(--surface1);
  color: var(--text1);

  .home-left-sidebar-container {
    background: var(--surface1);

    .left-sidebar-item {
      color: var(--text1) !important;
    }
  }

  .all-boards {
    background: var(--surface1);

    .title {
      color: var(--text1);
      line-height: 2rem;
      padding: 0;
      margin: 0;

      margin-left: 1rem;
    }

    .available-boards,
    .favorite-boards {
      margin-bottom: 4rem;
    }

    .boards-container {
      max-height: 400px;
      display: flex;
      flex-flow: row wrap;

      gap: 1.2rem;
      margin: 1rem 0 0 1rem;

      a {
        display: block;
        height: 85px;
        width: 130px;
        overflow-wrap: break-word;

        color: var(--text1);
        // border: 1px solid transparent;
        border-radius: 5px;

        padding: 0.6rem;

        &:hover {
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.25);
          // border-color: #3178c6;
        }
      }
    }

    .no-boards-msg,
    .no-favorites-msg {
      margin: 0.5rem 0 2rem 1rem;
    }
  }

  // .favorite-boards {
  //   background: var(--surface1);
  // }

  .separator {
    width: 80%;
    height: 1px;

    background-color: var(--text2);

    margin-left: 1.2rem;
    padding: 1px;
  }
}
</style>
