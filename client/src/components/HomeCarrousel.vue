<template>
  <section id="home-carousel">
    <v-carousel v-model="carrousel" hide-delimiter-background>
      <v-carousel-item v-for="img in images" :key="img.src">
        <v-row justify="center" class="v-carousel">
          <img
            :src="require('../assets/img/' + img.src)"
            :alt="img.alt"
            class="carousel-img"
          />
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </section>
</template>

<script>
export default {
  name: 'HomeCarousel',
  components: {},
  data() {
    return {
      carrousel: 0,
      images: [
        {
          src: 'captura-todolist.jpg',
          alt: 'Ejemplo TodoList',
        },
        {
          src: 'captura-create-board.jpg',
          alt: 'Ejemplo crear nuevo tablero',
        },
        {
          src: 'captura-change-owner.jpg',
          alt: 'Ejemplo cambiar propietario',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
#home-carousel {
  min-height: 100%;

  .carousel-img {
    // width: 100%;
    padding: 0.8rem;
    height: 500px;
    object-fit: contain;
  }
}
</style>
