<template>
  <div class="register-form">
    <!-- TODO Añadir mejores estilos -->
    <h2>Formulario de registro</h2>
    <v-form ref="form" :valid="valid" lazy-validation>
      <v-text-field
        v-model="username"
        :rules="usernameRules"
        label="Nombre de usuario"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        :append-icon="passwordShown ? 'mdi-eye' : 'mdi-eye-off'"
        :type="passwordShown ? 'text' : 'password'"
        label="Contraseña"
        required
        @keydown.enter="validate"
        @click:append="passwordShown = !passwordShown"
      >
      </v-text-field>
      <div class="button-container">
        <v-btn color="error" @click="this.$refs.form.reset()"> Reset </v-btn>

        <v-btn :disabled="!valid" color="success" @click="validate">
          Enviar
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import * as api from '../api.js';

export default {
  data() {
    return {
      username: '',
      password: '',
      minPasswordLength: 8,
      valid: true,
      passwordShown: true,
      usernameRules: [v => !!v || 'Nombre de usuario requerido'],
      passwordRules: [
        v => !!v || 'Contraseña requerida',
        v => (v && v.length >= 8) || 'El tamaño mínimo es de 8 caracteres',
      ],
    };
  },
  computed: {},
  watch: {
    min: 'validateField',
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.sendForm();
      } else {
        console.log('Algún campo incompleto');
      }
    },

    sendForm() {
      try {
        //TODO Validar
        //TODO Controlar HTTP codes
        api
          .register(this.username, this.password)
          .then(response => response)
          .then(data => {
            console.log(data);
            this.$router.push('/' + this.username);
            // this.$store.commit("changeUserData", {username: });
          });
      } catch (error) {
        console.error('Error al hacer la petición', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  text-align: center;
  color: $--font-color-dark;
}

.register-form {
  margin: 0.5rem 1rem;
}
.button-container {
  width: 100%;
  display: flex;
  justify-content: center;

  button:first-child {
    margin-right: 1rem;
  }
}

.button-container + a {
  display: flex;
  justify-content: center;

  margin: 1em;
}
</style>
