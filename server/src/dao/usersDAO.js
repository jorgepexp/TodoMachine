// Referencia a nuestra BDD
let users;

export default class UsersDAO {
  static async injectDB(conn) {
    // Si ya existe la referencia, devolvemos
    if (users) return;

    try {
      //Conectamos a mongoAtlas y especificamos la colección que vamos a utilizar
      users = await conn.db(process.env.DB_NS).collection('users');
      console.log('Conexión establecida con la colección de usuarios ✔️');
    } catch (error) {
      console.error(
        `No se ha podido establecer una conexión con usersDAO: ${error}`
      );
    }
  }

  static async getUsers({ filters = null, page = 0, usersPerPage = 20 }) {
    let query;
    let cursor;
    // Comprobamos si nos han pasado los filtros para acotar la búsqueda
    if (filters) {
      if ('username' in filters) {
        query = { username: { $eq: filters['username'] } };
      } else if ('id' in filters) {
        query = { _id: { $eq: filters['id'] } };
      } else if ('email' in filters) {
        query = { email: { $eq: filters['email'] } };
      } else if ('name' in filters) {
        query = { name: { $eq: filters['name'] } };
      } else if ('token' in filters) {
        query = { name: { $eq: filters['token'] } };
      }
    }

    try {
      cursor = await users.find(query);
    } catch (error) {
      console.error('No se ha podido ejecutar el comando find', error);
      return { users: [] };
    }

    // Limitamos los resultados del query a los pasados por parámetro
    const formattedCursor = cursor
      .limit(usersPerPage)
      .skip(usersPerPage * page);

    try {
      const usersList = await formattedCursor.toArray();
      return usersList;
    } catch (error) {
      console.error(
        `No se ha podido convertir el cursor a array o problema enumerando documentos`,
        error
      );
      return { users: [] };
    }
  }

  // static async findUser(username)

  static async addUser(username, password) {
    if (!username || !password) return;
    try {
      // let email = await users
      // 	.find({ email: { $eq: userData.email } })
      // 	.toArray()
      // 	.then(data => data);

      // Comprobamos si el username está siendo ya utilizado
      let username = await users
        .find({ username: username })
        .toArray()
        .then(data => data);

      // email.length !== 0 ||
      if (username.length) {
        throw new Error('Username ya utilizado');
      }

      const result = await users.insertOne({ username, password });
      return result;
    } catch (error) {
      throw new Error('No se ha podido introducir al usuario: Datos erróneos');
    }
  }
}
