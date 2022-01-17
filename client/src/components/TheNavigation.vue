<template>
  <div id="app-nav">
    <v-app-bar app color="primary" dark height="70">
      <v-img
        alt="Todo Machine Logo"
        class="mr-2 pd-2"
        src="../assets/frankyChibi.png"
        transition="scale-transition"
        width="50"
      />

      <v-toolbar-title class="nav-title">
        <router-link to="/todomachine">
          <span class="font-weight-medium white--text"> TODO MACHINE</span>
        </router-link>
      </v-toolbar-title>

      <router-link
        v-if="isUserLogged"
        :to="{
          name: 'mainBoard',
          params: { username: $store.state.user.username },
        }"
      >
        <v-btn text>
          <span class="mr-2">Tableros</span>
          <v-icon>mdi-bulletin-board</v-icon>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>
      <BoardCreationOverlay v-if="isUserLogged"></BoardCreationOverlay>
      <v-btn text @click="toggleDarkTheme">
        <v-icon>
          {{
            darkTheme ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny'
          }}
        </v-icon>
      </v-btn>

      <!-- Ajustes de usuario -->
      <div class="right-nav-container">
        <div v-if="!isUserLogged">
          <router-link to="/todomachine/login">
            <v-btn text>
              <span class="mr-2">Iniciar sesión</span>
              <v-icon>mdi-login</v-icon>
            </v-btn>
          </router-link>

          <router-link to="/todomachine/registro">
            <v-btn text>
              <span class="mr-2">Registro</span>
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </router-link>
        </div>
        <v-layout row class="align-center justify-end" v-else>
          <v-list-item-avatar
            color="secondary"
            size="45"
            class="mr-3"
            @click.stop="drawer = !drawer"
          >
            <img src="https://randomuser.me/api/portraits/women/42.jpg" />
          </v-list-item-avatar>
        </v-layout>
      </div>
    </v-app-bar>

    <!-- Profile sidebar  -->
    <v-navigation-drawer right absolute temporary v-model="drawer">
      <v-list nav dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{
              $store.state.user.username
            }}</v-list-item-title>
            <v-list-item-subtitle>Sesión iniciada</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item @click="logoutUser" class="cursor">
          <v-list-item-title>Logout</v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { logout } from '../api.js';
import BoardCreationOverlay from './BoardCreationOverlay.vue';
export default {
  name: 'AppNav',
  components: {
    BoardCreationOverlay,
  },
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    isUserLogged() {
      return this.$store.state.user.loggedIn;
    },
    darkTheme() {
      return this.$store.state.darkTheme;
    },
  },
  methods: {
    logoutUser() {
      logout()
        .then(() => {
          this.$store.commit('resetUser');
          this.$router.push('/todomachine');
          this.drawer = false;
        })
        .catch(error => console.error(`Algo ha ido mal: ${error}`));
    },
    toggleDarkTheme() {
      if (!this.$store.state.darkTheme) {
        this.$root.$el.setAttribute('color-scheme', 'dark');
        this.$store.commit('toggleDarkTheme');
        return;
      }
      this.$root.$el.setAttribute('color-scheme', 'light');
      this.$store.commit('toggleDarkTheme');
    },
  },
};
</script>

<style lang="scss">
.router-link-exact-active {
  text-decoration: none;
}

.right-nav-container {
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  flex-basis: 100%;
  align-items: center;

  & + div {
    background: orange;
    margin: 5rem;
  }
}

.v-toolbar__title {
  overflow: unset !important;
}

.cursor {
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
}
</style>
