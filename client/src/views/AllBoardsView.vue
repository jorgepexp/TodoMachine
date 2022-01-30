<template>
  <div id="all-boards-view">
    <v-list nav class="home-left-sidebar-container mt-10">
      <v-list-item-group v-model="selectedItem">
        <v-list-item
          v-for="(item, i) in leftMenuItems"
          :key="i"
          :dark="$store.state.darkTheme"
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
      <v-list-item-title class="title"
        ><span aria-hidden="true">✔️</span> Tableros
        disponibles</v-list-item-title
      >
      <div class="separator" aria-hidden="true"></div>
      <div class="available-boards">
        <div v-for="board in userBoards" :key="board._id">
          <router-link
            :to="{
              name: 'board',
              params: {
                username: $store.state.user.username,
                name: board.name,
              },
            }"
          >
            <span>{{ board.name }}</span>
          </router-link>
        </div>
      </div>

      <v-list class="favorite-boards mt-10">
        <v-list-item-title class="title"
          ><span aria-hidden="true">🌟</span> Tableros
          favoritos</v-list-item-title
        >
        <div class="separator" aria-hidden="true"></div>
        <!-- <v-list-item v-for="board in userBoards" :key="board._id">
        <router-link
          :to="{
            name: 'board',
            params: {
              username: $store.state.user.username,
              id: board.name,
            },
          }"
        >
          {{ board.name }}
        </router-link>
      </v-list-item> -->
      </v-list>
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
  }

  .all-boards {
    background: var(--surface1);

    .title {
      width: 100%;
      max-height: 34px;

      color: var(--text1);
      font-weight: normal;
      text-align: left;

      margin-left: 1rem;
    }

    .available-boards {
      max-height: 400px;
      display: flex;
      flex-flow: row wrap;

      gap: 1.2rem;
      margin: 1rem 0 0 1rem;

      div {
        overflow: hidden;
      }

      a {
        display: block;
        height: 85px;
        width: 130px;
        // transition: margin 0.3s ease-in-out;

        background: lightskyblue;
        color: var(--text1);
        border: 2px solid transparent;

        padding: 0.6rem;

        &:hover {
          // border: 2px solid darkblue;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.25);
          // height: 88px;
          border-color: #3178c6;
        }
      }
    }
  }

  .favorite-boards {
    background: var(--surface1);
  }

  .separator {
    width: 80%;
    height: 1px;

    background-color: var(--text2);

    margin-left: 1.2rem;
    padding: 1px;
  }
}
</style>
