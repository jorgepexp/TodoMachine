<template>
  <v-app>
    <TheNavigation />
    <v-main>
      <router-view />
    </v-main>
    <!-- <transition name="fade">
      <v-alert v-if="alert" :type="alertType">{{ alertMessage }}</v-alert>
    </transition> -->
  </v-app>
</template>

<script>
import TheNavigation from './components/TheNavigation.vue';

export default {
  name: 'App',
  components: {
    TheNavigation,
  },
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    isUserLogged() {
      return this.$store.state.user.status;
    },
  },
};
</script>

<style lang="scss">
// .v-main__wrap {
//   height: 100%;
//   aspect-ratio: 1;
// }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
