import mongo from 'mongodb';
const { ObjectId } = mongo;
let boards;

export default class BoardsDAO {
  static async injectDB(conn) {
    // Si ya existe la referencia a la colección, devolvemos
    if (boards) return;

    try {
      //Conectamos a mongoAtlas y especificamos la colección que vamos a utilizar
      boards = await conn.db(process.env.DB_NS).collection('boards');
      console.log('Conexión establecida con la colección de tableros ✔️');
    } catch (error) {
      console.error(
        `No se ha podido establecer una conexión con boardsDAO: ${error}`
      );
    }
  }

  static async getBoards(ownerID) {
    let objectID = new ObjectId(ownerID);

    let filter = { owner: objectID };
    let cursor;

    try {
      cursor = await boards.find(filter);
    } catch (error) {
      throw new Error('No se ha podido ejecutar el comando find');
    }

    try {
      return await cursor.toArray();
    } catch (error) {
      throw new Error(
        'No se ha podido convertir el cursor a array o problema enumerando documentos'
      );
    }
  }

  static async postBoard(boardData = null) {
    try {
      boardData.owner = new ObjectId(boardData.owner);

      const result = await boards.insertOne(boardData);
      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Error insertando nuevo tablero: ${error}`);
    }
  }

  static async patchBoard(boardID, data) {
    try {
      boardID = new ObjectId(boardID);
      const filter = { _id: boardID };

      //* Recuperamos key/value del objeto
      [data] = Object.entries(data);

      const result = await boards.updateOne(filter, {
        $set: {
          [data[0]]: data[1],
        },
      });

      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Error editando tablero: ${error}`);
    }
  }

  static async deleteBoard(boardID) {
    try {
      boardID = new ObjectId(boardID);
      const query = { _id: boardID };
      const result = await boards.deleteOne(query);
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Error borrando tablero: ${error}`);
    }
  }

  // TODO Comprobar que el ID de la lista no esté siendo utilizado
  static async postList(listData) {
    try {
      let { boardID, listID, name, index, todos } = listData;

      boardID = new ObjectId(boardID);
      const filter = { _id: boardID };

      todos = todos ?? [];

      const document = { id: listID, name, todos, index };

      const result = await boards.updateOne(filter, {
        $push: { todo_lists: document },
      });

      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Error al introducir lista: ${error}`);
    }
  }

  static async patchList(boardID, listID, data) {
    try {
      boardID = new ObjectId(boardID);

      const filter = { _id: boardID };
      const arrayFilters = [{ 'list.id': { $eq: listID } }];

      //* Recuperamos key/value del objeto
      [data] = Object.entries(data);

      const result = await boards.updateOne(
        filter,
        {
          $set: {
            [`todo_lists.$[list].${data[0]}`]: data[1],
          },
        },
        { arrayFilters }
      );

      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Error al editar nombre de la lista: ${error}`);
    }
  }

  static async deleteList(boardID, listID) {
    try {
      boardID = new ObjectId(boardID);

      const filter = { _id: boardID };
      const result = await boards.updateOne(filter, {
        $pull: { todo_lists: { id: listID } },
      });
      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Error al eliminar lista: ${error}`);
    }
  }

  static async postTodoItems(boardID, listID, todos) {
    try {
      boardID = new ObjectId(boardID);
      const filter = { _id: boardID };
      const arrayFilters = [{ 'list.id': { $eq: listID } }];

      const result = await boards.updateOne(
        filter,
        {
          $push: { 'todo_lists.$[list].todos': { $each: todos } },
        },
        { arrayFilters }
      );

      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Error al añadir TODO a la lista: ${error}`);
    }
  }

  static async deleteTodo(boardID, listID, todoID) {
    try {
      boardID = new ObjectId(boardID);
      const filter = { _id: boardID };
      const arrayFilters = [{ 'list.id': listID }];

      const result = await boards.updateOne(
        filter,
        {
          $pull: {
            'todo_lists.$[list].todos': {
              id: todoID,
            },
          },
        },
        { arrayFilters }
      );

      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Error al eliminar la tarea: ${error}`);
    }
  }

  static async patchTodo(boardID, listID, todoID, document) {
    try {
      boardID = new ObjectId(boardID);
      const filter = { _id: boardID };
      const arrayFilters = [
        { 'list.id': { $eq: listID } },
        { 'todo.id': { $eq: todoID } },
      ];

      //* Recuperamos key/value del objeto
      [document] = Object.entries(document);
      const identifier = `todo_lists.$[list].todos.$[todo].${[document[0]]}`;

      const result = await boards.updateOne(
        filter,
        {
          $set: {
            [identifier]: document[1],
          },
        },
        { arrayFilters }
      );
      return result.modifiedCount;
    } catch (error) {
      return { message: `Algo ha salido mal ${error.message}` };
    }
  }
}
