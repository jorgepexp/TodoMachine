<template>
  <section id="home-view">
    <main>
      <h3>Aumenta tu productividad organizando tus tareas en tableros</h3>
      <p>
        Ac massa a quisque cursus urna tristique sem accumsan purus lorem lacus
        sit a hendrerit leo pellentesque consectetur consectetur portaest lacus
        orci mi pellentesque varius.
      </p>
      <router-link :to="{ name: 'register' }">
        <v-btn class="register-btn">
          Regístrate gratis
        </v-btn>
      </router-link>
    </main>
    <HomeCarrousel />
  </section>
</template>

<script>
import HomeCarrousel from '@/components/HomeCarrousel.vue';
export default {
  name: 'HomeView',
  components: {
    HomeCarrousel,
  },
};
</script>

<style lang="scss">
@import url('http://fonts.cdnfonts.com/css/gordita');
#home-view {
  min-height: 100%;

  display: flex;
  flex-flow: column nowrap;
  flex: 1;

  background-color: var(--surface3);
  font-family: gordita, Helvetica Neue, Helvetica, sans-serif;
  padding: 1rem;

  main {
    margin-bottom: 3rem;

    h3 {
      font-family: gordita, Helvetica Neue, Helvetica, sans-serif;
      font-weight: 400;
      font-size: 2rem;
      color: var(--text1);
      line-height: 2.8rem;

      margin: 1rem 0 0.8rem 0;
    }

    p {
      line-height: 1.75rem;
      color: var(--text1);

      margin-bottom: 2rem;
    }

    .register-btn {
      background-color: hsl(0, 0%, 0%);
      color: hsl(0, 0%, 100%);

      &:hover {
        background-color: $--primary-color;
      }
    }
  }
}
</style>
