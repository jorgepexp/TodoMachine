import bcrypt from 'bcrypt';
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
    let filter;
    let cursor;
    //* Comprobamos si nos han pasado los filtros para acotar la búsqueda
    if (filters) {
      if ('username' in filters) {
        filter = { username: { $eq: filters['username'] } };
      } else if ('id' in filters) {
        filter = { _id: { $eq: filters['id'] } };
      } else if ('refreshToken' in filters) {
        filter = { refreshToken: { $eq: filters['refreshToken'] } };
      }
    }

    try {
      cursor = await users.find(filter);
    } catch (error) {
      console.error('No se ha podido ejecutar el comando find', error);
      return { users: [] };
    }

    //* Limitamos los resultados del query a los pasados por parámetro
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

  static async addUser(username, password) {
    try {
      //* Comprobamos si el username está siendo ya utilizado
      const user = await users
        .find({ username: username })
        .toArray()
        .then(data => data);

      if (user.length) {
        throw new Error('Username ya utilizado');
      }

      const result = await users.insertOne({ username, password });
      return result;
    } catch (error) {
      throw new Error('No se ha podido introducir al usuario: Datos erróneos');
    }
  }

  static async patchUser(filters, document) {
    let filter;
    //* Campos por los que se puede filtrar
    if (filters) {
      if ('username' in filters) {
        filter = { username: { $eq: filters['username'] } };
      } else if ('id' in filters) {
        filter = { _id: { $eq: filters['id'] } };
      } else if ('refreshToken' in filters) {
        filter = { refreshToken: { $eq: filters['refreshToken'] } };
      }
    }

    //* Recuperamos key/value
    [document] = Object.entries(document);

    //* Si es contraseña, la encriptamos
    if (document[0] === 'password')
      document[1] = await bcrypt.hash(document[1], parseInt(11));

    try {
      const result = await users.updateOne(filter, {
        $set: {
          [document[0]]: document[1],
        },
      });

      return result.modifiedCount;
    } catch (error) {
      return { message: `Algo ha salido mal ${error.message}` };
    }
  }
}
