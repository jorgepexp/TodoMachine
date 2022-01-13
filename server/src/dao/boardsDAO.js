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

    let query = { owner: objectID };
    let cursor;

    try {
      cursor = await boards.find(query);
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

  // TODO Comprobar que el ID de la lista no esté siendo utilizado
  static async postList(listData = null) {
    try {
      let { boardID, listID, name, index } = listData;

      console.log(index);

      boardID = new ObjectId(boardID);
      let query = { _id: boardID };

      const document = { id: listID, name, todos: [], index };

      const result = await boards.updateOne(query, {
        $push: { todo_lists: document },
      });

      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Error al introducir lista: ${error}`);
    }
  }

  static async editList(boardID, listID, index, listName) {
    try {
      boardID = new ObjectId(boardID);

      let query = { _id: boardID };
      let arrayFilters = [{ 'list.id': { $eq: listID } }];

      //Si han pasado un índice, ejecutamos esa query, si no, será el nombre el que se haya pasado
      let data =
        index !== undefined
          ? { 'todo_lists.$[list].index': index }
          : { 'todo_lists.$[list].name': listName };

      const result = await boards.updateOne(
        query,
        {
          $set: data,
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

      let query = { _id: boardID };
      const result = await boards.update(query, {
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
      const query = { _id: boardID };
      const arrayFilters = [{ 'list.id': { $eq: listID } }];

      const result = await boards.updateOne(
        query,
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

  //TODO Que se pueda editar diferentes datos desde el mismo método
  static async editTodo(boardID, listID, todoID, index) {
    try {
      boardID = new ObjectId(boardID);
      const query = { _id: boardID };
      const arrayFilters = [
        { 'list.id': { $eq: listID } },
        { 'todo.id': { $eq: todoID } },
      ];
      const result = await boards.updateOne(
        query,
        {
          $set: { 'todo_lists.$[list].todos.$[todo].index': index },
        },
        { arrayFilters }
      );

      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Error al editar TODO: ${error}`);
    }
  }

  static async deleteTodo(boardID, listID, todoID) {
    try {
      boardID = new ObjectId(boardID);
      const query = { _id: boardID };
      const arrayFilters = [{ 'list.id': listID }];

      const result = await boards.updateOne(
        query,
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
}
