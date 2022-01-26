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
    // Comprobamos si nos han pasado los filtros para reducir la búsqueda
    if (filters) {
      if ('username' in filters) {
        query = { username: { $eq: filters['username'] } };
      } else if ('id' in filters) {
        query = { _id: { $eq: filters['id'] } };
      } else if ('email' in filters) {
        query = { email: { $eq: filters['email'] } };
      } else if ('name' in filters) {
        query = { name: { $eq: filters['name'] } };
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

  static async addUser(userData = null) {
    console.log(userData);
    if (!userData) return;

    if (userData.username && userData.password) {
      try {
        // let email = await users
        // 	.find({ email: { $eq: userData.email } })
        // 	.toArray()
        // 	.then(data => data);

        // Comprobamos si cualquiera de los datos está siendo ya utilizado
        let username = await users
          .find({ username: userData.username })
          .toArray()
          .then(data => data);

        // email.length !== 0 ||
        if (username.length) {
          throw new Error('Username ya utilizado');
        }

        let modifiedCount = await users.insertOne(userData);
        return modifiedCount;
      } catch (error) {
        throw new Error(
          'No se ha podido introducir al usuario: Datos erróneos'
        );
      }
    } else {
      throw new Error('Datos incompletos para introducir al usuario');
    }
  }
}
