<div id="top"></div>

[![LinkedIn][linkedin-shield]][linkedin-url]

<!--   <a href="https://github.com/jorgepexp/WikiKahoot">
    <img src="src/assets/logo.png" alt="Logo" width="150" height="120">
  </a> -->

<h1>Todo Machine</h1>

  <p>
    Mejora tu productividad, crea tus tareas en forma de listas y ordénalas en tableros en esta aplicación inspirada en Trello.
  </p>

<!-- TABLE OF CONTENTS -->
<details>
  <summary><strong>Tabla de contenido</strong></summary>
  <ol>
    <li>
      <a href="#acerca-del-proyecto">Acerca del proyecto</a>
      <ul>
        <li><a href="#demo">Demo</a></li>
        <li><a href="#construido-con">Construido con</a></li>
        <li><a href="#ejemplos-de-uso">Ejemplos de uso</a></li>
        <li><a href="#instalación">Instalación</a></li>
        <li><a href="#contacta-conmigo">Contacta conmigo</a></li>
        <li><a href="#bugs">Bugs</a></li>
        <li><a href="#qué-he-aprendido">Qué he aprendido</a></li>
      </ul>
    </li>
  </ol>
</details>
</br>

## Acerca del proyecto

Aplicación de tareas, ordenadas mediante listas y tableros al estilo Trello.

- Frontend realizado tanto con la librería de componentes como con soluciones propias utilizando SCSS.
- Posee sistema de autenticación y autorización mediante JWT de acceso/refresco.
- Sistema custom de drag & drop para mover listas y tareas.
- Hace uso de CSS custom variables para cambiar entre tema claro y oscuro.
- Responsive.

## Demo

[Para hacer](https://google.com)

## Construido con

- [Vuex](https://vuex.vuejs.org/) - Vue State Managment
- [Vue-router](https://router.vuejs.org/) - Vue Routing Solution
- [Node](https://nodejs.org/) - Backend Language
- [Express](https://expressjs.com/) - Node Library
- [MongoDB](https://www.mongodb.com/) - NoSQL Database
- [SCSS](https://sass-lang.com/) - Style Language / Preprocessor
- [Vuetify](https://vuetifyjs.com/) - Vue Component Library

## Ejemplos de uso

- Creando un tablero
  ![Captura de pantalla- Tablero creado][product-screenshot1]
- Añadir items a la lista
  ![Captura de pantalla- Añadiendo items a las listas][product-screenshot2]
- Cambiar propietario del tablero
  ![Captura de pantalla- Cambiar propietario del tablero][product-screenshot3]
- Modo oscuro
  ![Captura de pantalla- Modo oscuro][product-screenshot4]

<p align="right">(<a href="#top">vuelta arriba</a>)</p>

## Instalación

1. Clona el repo
   ```sh
   git clone https://github.com/jorgepexp/TodoMachine.git
   ```
2. Instala los paquetes NPM en las carpetas server y client
   ```sh
   npm install
   ```
3. Lanza el cliente desde /client
   ```sh
   npm run serve
   ```
4. Lanza el servidor desde /server
   ```sh
   npm run dev
   ```

  
<p align="right">(<a href="#top">vuelta arriba</a>)</p>

## Contacta conmigo

Jorge Pérez Expósito - jorge.pexp@gmail.com

Link al repositorio: [https://github.com/jorgepexp/TodoMachine](https://github.com/jorgepexp/TodoMachine)

<p align="right">(<a href="#top">vuelta arriba</a>)</p>

## Bugs

Si encuentras algún bug en la aplicación o simplemente quieres sugerir alguna mejora, me ayudaría mucho si dejas aquí tu [pull request](https://github.com/jorgepexp/TodoMachine/pulls)

<p align="right">(<a href="#top">vuelta arriba</a>)</p>

<!-- LEARNING -->

## Qué he aprendido

¿Qué cosas he aprendido mientras realizaba este proyecto?

- Mejora a la hora de escribir los commits en GIT.
- Cómo funcionan los token JWT de acceso/refresco y cómo implementarlos en una aplicación con Node.
- La forma de aprovechar varias de las grandes ventajas que tienen las custom properties en CSS.
- Desenvolverme mejor estilando en una librería de componentes.
- Mejor entendimiento de los códigos HTTP para devolver errores más significativos.
- Cómo desenvolverme en MongoAtlas.
- A perseverar ante los contratiempos del proyecto.

<p align="right">(<a href="#top">vuelta arriba</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/jorge-perez-exposito
[product-screenshot]: src/assets/imagen.png
[product-screenshot1]: src/assets/img/captura-create-owner.png
[product-screenshot2]: src/assets/img/captura-change-owner.png
[product-screenshot3]: src/assets/img/captura-todolist.png
