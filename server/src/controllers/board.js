import boardsDAO from '../dao/boardsDAO.js';

class TablonController {
  // Métodos de tablero
  async getBoard(req, res) {
    let id = req.params.id;
    let boards;
    try {
      boards = await boardsDAO.getBoards(id);
    } catch (error) {
      return res.status(500).json(`Algo ha ido mal: ${error.message}`);
    }

    let response = { boards };

    return res.status(200).json(response);
  }

  async postBoard(req, res) {
    try {
      const { name, ownerID } = req.body;

      if (!name || !ownerID) {
        return res.status(400).json({
          message: 'Datos para añadir nuevo tablero incompletos',
          error: true,
        });
      }

      const boardData = { name, owner: ownerID, todo_lists: [] };

      let board = await boardsDAO.postBoard(boardData);

      return res
        .status(201)
        .json({ message: 'Tablero añadido correctamente ✔️', board });
    } catch (error) {
      return res.status(400).json(`Algo ha ido mal: ${error.message}`);
    }
  }

  // Métodos de lista
  async postList(req, res) {
    try {
      let { boardID, listID, name, index } = req.body;

      if (
        isNaN(parseFloat(listID)) ||
        !name ||
        !boardID ||
        isNaN(parseFloat(index))
      ) {
        return res.status(400).json({
          message: 'Datos para añadir nueva lista incompletos',
          error: true,
        });
      }

      let listData = { boardID, listID, name, index };

      let modifiedCount = await boardsDAO.postList(listData);
      if (modifiedCount === 0) {
        return res.status(200).json({
          message: 'No se ha podido insertar la lista',
          error: true,
        });
      }

      return res
        .status(201)
        .json({ message: 'Lista añadida correctamente ✔️', error: false });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async editList(req, res) {
    try {
      const { boardID, listID, index, name } = req.body;

      if (isNaN(parseFloat(listID)) || !boardID) {
        return res.status(400).json({
          message: 'Faltan datos para editar el nombre de la lista',
          error: true,
        });
      }

      let modifiedCount = await boardsDAO.editList(
        boardID,
        listID,
        index,
        name
      );

      if (modifiedCount === 0) {
        return res.status(200).json({
          message: 'No se ha podido editar la lista',
          error: true,
        });
      }

      return res
        .status(201)
        .json({ message: 'Lista editada correctamente ✔️', error: false });
    } catch (error) {
      return res.status(400).json({ message: error.message, error: true });
    }
  }

  async deleteList(req, res) {
    let { boardID, listID } = req.body;
    if (isNaN(parseFloat(listID)) || !boardID)
      return res.status(400).json({ message: 'Bad request', error: true });

    try {
      let deletedCount = await boardsDAO.deleteList(boardID, listID);

      if (deletedCount === 0) {
        return console.log('Ningún documento eliminado');
      }

      return res.status(200).json({
        message: 'Documento eliminado',
        error: false,
      });
    } catch (error) {
      return res.status(200).json({
        message: 'No se ha podido eliminar la lista',
        error: error.message,
      });
    }
  }

  // Métodos de todo's
  async postTodoItems(req, res) {
    try {
      const { boardID, listID, todos } = req.body;
      if (!Array.isArray(todos) || todos.length === 0 || !boardID) {
        return res
          .status(400)
          .json({ message: 'Datos para añadir todo incompleto', error: true });
      }

      let modifiedCount = await boardsDAO.postTodoItems(boardID, listID, todos);

      if (modifiedCount === 0) {
        return res.status(200).json({
          message: 'No se han podido insertar los todos',
          error: true,
        });
      }

      return res
        .status(201)
        .json({ message: 'Todos añadidos correctamente ✔️', error: false });
    } catch (error) {
      return res.status(400).json({
        message: 'No se han podido insertar los todos',
        error: error.message,
      });
    }
  }

  // TODO Método sobrecargado. Su responsabilidad debería ser solo cambiar el index de la lista
  async editTodo(req, res) {
    try {
      const { boardID, listID, todoID, index } = req.body;

      if (
        !boardID ||
        isNaN(parseFloat(listID)) ||
        isNaN(parseFloat(todoID)) ||
        isNaN(parseFloat(index))
      ) {
        return res
          .status(400)
          .json({ message: 'Faltan datos para editar la tarea', error: true });
      }

      let modifiedCount = await boardsDAO.editTodo(
        boardID,
        listID,
        todoID,
        index
      );

      if (modifiedCount === 0) {
        return res.status(200).json({
          message: 'No se ha podido editar la tarea',
          error: true,
        });
      }

      return res
        .status(201)
        .json({ message: 'Tarea editada correctamente ✔️', error: false });
    } catch (error) {
      return res.status(400).json({ message: error.message, error: true });
    }
  }

  async deleteTodo(req, res) {
    let { boardID, listID, todoID } = req.body;
    if (!boardID || isNaN(parseFloat(listID)) || isNaN(parseFloat(todoID)))
      return res.status(400).json({ message: 'Bad request', error: true });

    try {
      let deletedCount = await boardsDAO.deleteTodo(boardID, listID, todoID);
      console.log(listID, todoID);
      if (deletedCount === 0 || deletedCount === undefined) {
        return res.status(200).json({
          message: 'No se ha podido eliminar la tarea',
          error: true,
        });
      }

      return res.status(200).json({
        message: 'Tarea eliminada',
        error: false,
      });
    } catch (error) {
      return res.status(200).json({
        message: 'No se ha podido eliminar la tarea',
        error: error.message,
      });
    }
  }
}
export default new TablonController();
