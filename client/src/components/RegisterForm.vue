<template>
  <div id="register-form">
    <h2>Formulario de registro</h2>
    <v-form ref="form" class="register-form" :valid="valid">
      <v-text-field
        v-model="username"
        @keydown.enter="validate"
        class="form-input"
        :rules="usernameRules"
        :dark="this.$store.state.darkTheme"
        label="Nombre de usuario"
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
        required
      >
      </v-text-field>
      <div class="button-container">
        <v-btn color="error" @click="$refs.form.reset()"> Reset </v-btn>

        <v-btn :disabled="!valid" color="success" @click="validate">
          Enviar información
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { register } from '../api.js';

export default {
  data() {
    return {
      username: '',
      password: '',
      minPasswordLength: 8,
      valid: true,
      passwordShown: false,
      usernameRules: [v => !!v || 'Nombre de usuario requerido'],
      passwordRules: [
        v => !!v || 'Contraseña requerida',
        v =>
          (v && v.length >= 8) ||
          'La contraseña debe tener mínimo 8 caracteres',
      ],
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) this.sendForm();
    },
    sendForm() {
      try {
        register(this.username, this.password).then(async response => {
          if (response.status === 200) {
            await this.$store.dispatch('setUser', {
              username: this.username,
              id: response.data.id,
              token: response.data.token,
            });
            this.$store.commit('changeUserStatus');
            await this.$store.dispatch('fetchBoards');

            this.$router.push({
              name: 'mainBoard',
              params: { username: this.$store.state.user.username },
            });
          }
        });
      } catch (error) {
        console.error('Error al hacer la petición', error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#register-form {
  background-color: var(--surface1);
  min-height: 100%;
}

h2 {
  text-align: center;
  color: var(--text1);

  padding: 1rem;
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
