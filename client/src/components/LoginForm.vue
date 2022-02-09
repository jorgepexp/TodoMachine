<template>
  <div id="login-form">
    <h2>Formulario de inicio de sesión</h2>

    <v-form ref="form" class="login-form" v-model="valid">
      <v-text-field
        v-model="username"
        @keydown.enter="validate"
        :rules="usernameRules"
        label="Usuario"
        required
        autofocus
      ></v-text-field>

      <v-text-field
        v-model="password"
        @keydown.enter="validate"
        @click:append="passwordShown = !passwordShown"
        :rules="passwordRules"
        :append-icon="passwordShown ? 'mdi-eye' : 'mdi-eye-off'"
        :type="passwordShown ? 'text' : 'password'"
        label="Contraseña"
        counter
        required
      ></v-text-field>

      <div v-show="error" class="error-container">
        Usuario o contraseña incorrectos
      </div>

      <div class="button-container">
        <v-btn depressed color="error" @click="reset">Reset</v-btn>
        <v-btn depressed color="success" :disabled="!valid" @click="validate"
          >Iniciar sesión</v-btn
        >
      </div>
      <a
        ><router-link to="/todomachine/registro"
          >¿Todavía no estás registrado?</router-link
        ></a
      >
    </v-form>
  </div>
</template>

<script>
import { login } from '../api.js';

export default {
  data() {
    return {
      valid: false,
      username: '',
      usernameRules: [v => !!v || 'Nombre de usuario requerido'],
      password: '',
      passwordShown: false,
      passwordRules: [
        v => !!v || 'Contraseña requerida',
        v => (v && v.length >= 8) || 'El tamaño mínimo es de 8 caracteres',
      ],
      error: false,
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) this.sendForm();
    },
    async sendForm() {
      try {
        login(this.username, this.password).then(response => {
          if (response.status === 200) {
            this.$store.dispatch('setUser', {
              username: this.username,
              id: response.data.id,
              token: response.data.token,
            });
            this.$store.commit('changeUserStatus');
            this.getRandomPfp();
            this.$store.dispatch('fetchBoards');

            this.$router.push({
              name: 'mainBoard',
              params: { username: this.$store.state.user.username },
            });
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    getRandomPfp() {
      fetch('https://randomuser.me/api/')
        .then(response => response.json())
        .then(data => {
          let profilePic = data.results[0].picture.medium;
          this.$store.commit('setUserProfilePicture', { profilePic });
        });
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
#login-form {
  background-color: var(--surface1);
  min-height: 100%;
}

.login-form {
  margin: 0.5rem 1rem;
}

.v-text-field input {
  background-color: white !important;
}

h2 {
  text-align: center;
  color: var(--text1);

  margin: 1rem;
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

.error-container {
  width: 250px;
  margin: 1em auto;

  color: red;
}
</style>
