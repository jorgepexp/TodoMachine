<template>
  <div class="login-form">
    <h2>Formulario de inicio de sesión</h2>

    <v-form ref="form" v-model="valid" @submit="validate">
      <v-text-field
        :rules="usernameRules"
        v-model="username"
        @keydown.enter="validate"
        label="Usuario"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        :append-icon="passwordShown ? 'mdi-eye' : 'mdi-eye-off'"
        :type="passwordShown ? 'text' : 'password'"
        label="Contraseña"
        counter
        required
        @keydown.enter="validate"
        @click:append="passwordShown = !passwordShown"
      ></v-text-field>

      <div v-show="error" class="error-container">
        Usuario o contraseña incorrectos
      </div>

      <div class="button-container">
        <v-btn depressed color="error" @click="reset">Reset</v-btn>
        <v-btn depressed color="success" @click="validate"
          >Iniciar sesión</v-btn
        >
      </div>
      <a
        ><router-link to="/registro"
          >¿Todavía no estás registrado?</router-link
        ></a
      >
    </v-form>
  </div>
</template>

<script>
import * as api from '../api.js';

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
      usuario: {},
      error: false,
    };
  },

  // async created() {
  //   this.usuario = await api.getTablonPersonal();
  //   if (typeof this.usuario === "undefined") {
  //     console.log("Usuario es undefined");
  //     return;
  //   }
  //   console.log(this.usuario);
  // },

  methods: {
    async login() {
      if (!(this.username && this.password)) {
        this.error = true;
        return console.log('Datos para login incompletos');
      }

      try {
        api
          .login(this.username, this.password)
          .then(response => {
            if (response.status === 200) {
              // Almacenamos los datos del usuario en store
              this.$store.dispatch('setUser', {
                username: this.username,
                id: response.data.id,
                token: response.data.token,
              });
              this.$store.commit('changeUserStatus');
              this.$store.dispatch('fetchBoards');

              this.$router.push({
                name: 'mainBoard',
                params: { username: this.$store.state.user.username },
              });
            }
          })
          .catch(error => {
            console.error(error.response.data.message);
            this.error = true;
          });
      } catch (error) {
        console.error(error);
      }
    },
    reset: function() {
      this.$refs.form.reset();
      this.error = false;
    },
    validate: function() {
      if (this.$refs.form.validate()) {
        this.login();
      } else {
        this.error = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$dark-font-color: hsl(20, 0%, 5%);

.login-form {
  margin: 0.5rem 1rem;
}

h2 {
  text-align: center;
  color: $dark-font-color;
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
  //  nested router-link
  a {
    text-decoration: none;
  }
}

.error-container {
  width: 250px;
  margin: 1em auto;

  color: red;
}
</style>
