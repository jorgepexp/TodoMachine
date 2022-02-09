<template>
  <section id="home-carrousel">
    <v-carousel
      v-model="carrousel"
      hide-delimiter-background
      show-arrows-on-hover
    >
      <v-carousel-item v-for="img in images" :key="img.src">
        <v-row align="center" justify="center">
          <img
            :src="require('../assets/img/' + img.src)"
            :alt="img.alt"
            class="carrousel-img"
          />
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </section>
</template>

<script>
export default {
  name: 'HomeCarrousel',
  components: {},
  data() {
    return {
      carrousel: 0,
      // TODO Que las imágenes se pasen al componente como props
      images: [
        {
          src: 'luffy.jpg',
          alt: 'Luffy',
        },
        {
          src: 'jinbei.jpg',
          alt: 'Jinbei',
        },
        {
          src: 'zoro.jpg',
          alt: 'Zoro',
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss">
#home-carrousel {
  min-height: 100%;

  .carrousel-img {
    width: 100%;
    height: 500px;
    object-fit: contain;
  }
}
</style>
