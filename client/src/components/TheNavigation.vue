<template>
  <div id="app-nav">
    <v-app-bar app dark height="70" class="navigation">
      <router-link :to="{ name: 'home' }">
        <v-img
          alt="Todo Machine Logo"
          class="mr-2 pd-2"
          src="../assets/frankyChibi.png"
          transition="scale-transition"
          width="50"
        />
      </router-link>

      <v-toolbar-title class="nav-title">
        <router-link :to="{ name: 'home' }">
          <span class="font-weight-medium white--text text-uppercase">
            todo <span>machine</span>
          </span>
        </router-link>
      </v-toolbar-title>

      <!-- Para versión mobile -->
      <v-menu offset-y class="dropdown-menu">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="dropdown-menu-btn"
            :class="!isUserLogged ? 'ml-auto' : ''"
            x-small
            color="transparent"
            elevation="0"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon> mdi-menu </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-if="!isUserLogged">
            <router-link :to="{ name: 'login' }">
              <v-btn text>
                <span class="mr-2">Iniciar sesión</span>
                <v-icon>mdi-login</v-icon>
              </v-btn>
            </router-link>
          </v-list-item>

          <v-list-item v-if="!isUserLogged">
            <router-link :to="{ name: 'register' }" class="register-btn">
              <v-btn text>
                <span class="mr-2">Registro</span>
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </router-link>
          </v-list-item>

          <v-list-item v-if="isUserLogged">
            <router-link
              :to="{
                name: 'mainBoard',
                params: { username: $store.state.user.username },
              }"
            >
              <v-btn text>
                <span class="pr-2">Tus tableros</span>
                <v-icon>mdi-bulletin-board</v-icon>
              </v-btn>
            </router-link>
          </v-list-item>

          <v-list-item v-if="isUserLogged">
            <BoardCreationOverlay mobile />
          </v-list-item>

          <v-list-item>
            <v-btn text @click="toggleDarkTheme">
              <span class="pr-2">Alternar tema</span>
              <v-icon>
                {{
                  !darkTheme
                    ? 'mdi-moon-waning-crescent'
                    : 'mdi-white-balance-sunny'
                }}
              </v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>

      <router-link
        v-if="isUserLogged"
        :to="{
          name: 'mainBoard',
          params: { username: $store.state.user.username },
        }"
        class="mr-3"
      >
        <v-btn text class="user-boards-link">
          <span class="mr-2">Tableros</span>
          <v-icon>mdi-bulletin-board</v-icon>
        </v-btn>
      </router-link>

      <BoardCreationOverlay v-if="isUserLogged" class="create-board-btn" />

      <v-btn text @click="toggleDarkTheme" class="toggle-theme-btn">
        <v-icon>
          {{
            !darkTheme ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny'
          }}
        </v-icon>
      </v-btn>

      <!-- Ajustes de usuario -->
      <div class="user-settings-container">
        <div v-if="!isUserLogged">
          <router-link :to="{ name: 'login' }" class="login-btn">
            <v-btn text>
              <span class="mr-2">Iniciar sesión</span>
              <v-icon>mdi-login</v-icon>
            </v-btn>
          </router-link>

          <router-link :to="{ name: 'register' }" class="register-btn">
            <v-btn text>
              <span class="mr-2">Registro</span>
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </router-link>
        </div>
        <v-layout row class="align-center justify-end" v-else>
          <v-icon color="white" large @click.stop="drawer = !drawer">
            mdi-account-circle
          </v-icon>
        </v-layout>
      </div>
    </v-app-bar>

    <!-- Profile sidebar  -->
    <!-- TODO Se puede trasladar a componente -->
    <v-navigation-drawer
      absolute
      left
      temporary
      v-model="drawer"
      :dark="this.$store.state.darkTheme"
    >
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
        <v-list-item @click="logoutUser" class="logout-container">
          <v-list-item-title>Cerrar sesión</v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { logout } from '@/api/api.js';
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
        .then(async () => {
          this.drawer = false;
          await this.$store.dispatch('resetUser');
          await this.$router.push({ name: 'home' });
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
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
#app-nav {
  .navigation {
    background-color: $--primary-color-transparent !important;
  }

  .nav-title {
    overflow: visible !important;

    span {
      font-size: 17px;
      display: flex;
      align-items: center;
      margin-right: 0.3rem;

      span {
        font-family: 'VT323', monospace;
        font-weight: 400;
        font-size: 26px;

        padding-left: 3px;
      }
    }
  }

  .toggle-theme-btn,
  .create-board-btn,
  .dropdown-menu-btn,
  .user-boards-link,
  .register-btn,
  .login-btn {
    display: none;
  }

  .logout-container {
    opacity: 0.7;

    &:hover {
      opacity: 1;
    }
  }

  .user-settings-container {
    position: absolute;
    right: 25px;
  }

  @media (max-width: 600px) {
    .dropdown-menu-btn {
      display: block !important;
      height: 24px !important;
    }

    .create-board-msg {
      display: none;
    }
  }

  @media (min-width: 600px) {
    .user-settings-container {
      display: flex;
      flex-grow: 1;
      flex-basis: 100%;
      justify-content: flex-end;
      align-items: center;
    }

    .toggle-theme-btn,
    .create-board-btn,
    .user-boards-link,
    .register-btn,
    .login-btn {
      display: inline-block;
    }
  }

  // @media (max-width: 990px) {

  // }
}
</style>
