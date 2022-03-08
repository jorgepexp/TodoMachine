<template>
  <div id="register-form">
    <h2>Formulario de registro</h2>
    <v-form
      ref="form"
      @submit.prevent="handleSubmit"
      class="register-form"
      :valid="isValid"
    >
      <v-text-field
        v-model="username"
        id="username-input"
        @keydown.enter="handleSubmit"
        :rules="usernameRules"
        :dark="this.$store.state.darkTheme"
        type="text"
        label="Nombre de usuario"
        autocomplete="off"
        required
        :aria-invalid="isValid"
      ></v-text-field>

      <v-text-field
        v-model="password"
        @keydown.enter="handleSubmit"
        @click:append="passwordShown = !passwordShown"
        :rules="passwordRules"
        :append-icon="passwordShown ? 'mdi-eye' : 'mdi-eye-off'"
        :dark="this.$store.state.darkTheme"
        :type="passwordShown ? 'text' : 'password'"
        label="Contraseña"
        autocomplete="new-password"
        required
        :aria-invalid="isValid"
      >
      </v-text-field>
      <div class="button-container">
        <v-btn color="error" @click="$refs.form.reset()"> Reset </v-btn>

        <v-btn :disabled="!isValid" color="success" @click="handleSubmit">
          Enviar información
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import { register } from '@/api/api.js';

export default {
  data() {
    return {
      username: '',
      password: '',
      isValid: true,
      passwordShown: false,
      usernameRules: [
        v => !!v || 'Nombre de usuario requerido',
        v =>
          (v && v.length >= 3) ||
          'El nombre de usuario debe tener mínimo 3 caracteres',
        v =>
          (v && v.length <= 23) ||
          'El nombre de usuario debe tener máximo 23 caracteres',
      ],
      passwordRules: [
        v => !!v || 'Contraseña requerida',
        v =>
          (v && v.length >= 8) ||
          'La contraseña debe tener mínimo 8 caracteres',
        v =>
          (v && v.length <= 24) ||
          'La contraseña debe tener máximo 24 caracteres',
      ],
    };
  },
  methods: {
    handleSubmit() {
      if (!this.$refs.form.validate()) return;
      try {
        register(this.username, this.password).then(async response => {
          if (response.status === 200) {
            // TODO Manejar el refreshToken devuelto
            await this.$store.dispatch('setUser', {
              username: this.username,
              id: response.data.id,
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
