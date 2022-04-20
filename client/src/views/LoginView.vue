<template>
  <div id="login-form">
    <h2>Formulario de inicio de sesión</h2>

    <v-form
      ref="form"
      class="login-form"
      v-model="valid"
      @submit.prevent="validate"
    >
      <v-text-field
        v-model="username"
        @keydown.enter="validate"
        :rules="usernameRules"
        :dark="this.$store.state.darkTheme"
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
        :dark="this.$store.state.darkTheme"
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
    </v-form>
    <div class="d-flex justify-center mt-8">
      <router-link to="/todomachine/registro"
        >¿Todavía no estás registrado?</router-link
      >
    </div>
  </div>
</template>

<script>
import { login } from '@/api/api.js';
// import axios from 'axios';

export default {
  props: {
    redirect: {
      type: Boolean,
      default: false,
    },
  },
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
        login(this.username, this.password).then(async response => {
          if (response.status === 200) {
            this.$store.dispatch('setUser', {
              username: this.username,
              id: response.data.id,
              accessToken: response.data.accessToken,
            });

            this.$store.commit('changeUserStatus');
            await this.$store.dispatch('fetchBoards');

            //* Friendly login cuando expira el JWT de refresco
            if (this.redirect) {
              this.$router.go(-1);
            } else {
              this.$router.push({
                name: 'mainBoard',
                params: { username: this.$store.state.user.username },
              });
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
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

h2 {
  text-align: center;
  color: var(--text1);

  padding: 1rem;
}

.button-container {
  width: 100%;
  display: flex;
  justify-content: center;

  button:first-child {
    margin-right: 1rem;
  }
}

.error-container {
  width: 250px;
  margin: 1em auto;

  color: red;
}
</style>
