<template>
  <div id="main-board">
    <v-card max-width="225" class="home-left-sidebar-container">
      <v-list nav class="border-shadow-0">
        <v-list-item-group v-model="selectedItem">
          <v-list-item
            v-for="(item, i) in leftMenuItems"
            :key="i"
            class="pr-16"
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
    </v-card>

    <v-list class="available-boards">
      <v-list-item>
        <v-list-item-title>Tableros disponibles</v-list-item-title>
        <v-list-item v-for="board in userBoards" :key="board._id">
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
        </v-list-item>
        <!-- <v-list-item-icon>
                <v-icon>mdi-star</v-icon>
              </v-list-item-icon> -->
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'UserBoardView',
  components: {},
  data() {
    return {
      selectedItem: 0,
      //TODO: Añadir funcionalidad a cada uno de los botones
      // ? Cada objeto tendrá una referencia a una función
      leftMenuItems: [
        {
          icon: 'mdi-bulletin-board',
          text: 'Tableros',
        },
        {
          icon: 'mdi-view-dashboard',
          text: 'Plantillas',
        },
        {
          icon: 'mdi-home-analytics',
          text: 'Inicio',
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
#main-board {
  min-height: 100%;
  background: var(--surface1);
  display: grid;
  grid-template-columns: 20% 1fr;

  .home-left-sidebar-container {
    background: var(--surface1);
    color: var(--text1);

    .v-list {
      background: var(--surface2);

      .v-list-item {
        color: var(--text1);
      }
    }
  }

  .available-boards {
    background: inherit;

    width: 900px;
    min-height: 400px;

    overflow: auto;

    .v-list-item__title {
      color: var(--text1);
    }
  }
}
</style>
