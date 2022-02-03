import boardsDAO from '../dao/boardsDAO.js';

class TablonController {
  async getBoard(req, res) {
    const id = req.params.id;
    let boards;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        message: 'Datos para obtener tablero incompletos',
        error: true,
      });
    }

    try {
      boards = await boardsDAO.getBoards(id);
    } catch (error) {
      return res.status(500).json(`Algo ha ido mal: ${error.message}`);
    }

    const response = { boards };
    return res.status(200).json(response);
  }

  async postBoard(req, res) {
    const { ownerID, name } = req.body;
    if (!name || !ownerID) {
      return res.status(400).json({
        message: 'Datos para añadir nuevo tablero incompletos',
        error: true,
      });
    }

    try {
      const boardData = { name, owner: ownerID, todo_lists: [] };

      let board = await boardsDAO.postBoard(boardData);

      return res
        .status(201)
        .json({ message: 'Tablero añadido correctamente ✔️', board });
    } catch (error) {
      return res.status(500).json(`Algo ha ido mal: ${error.message}`);
    }
  }

  async patchBoard(req, res) {
    const { boardID, name } = req.body;
    if (!boardID || (!name && typeof name !== 'string')) {
      return res.status(400).json({
        message: 'Bad request',
        error: true,
      });
    }

    try {
      let modifiedCount = await boardsDAO.patchBoard(boardID, name);

      if (modifiedCount === 0) {
        return res.status(200).json({
          message: 'No se ha podido editar el tablero',
          error: true,
        });
      }

      return res
        .status(201)
        .json({ message: 'Tablero editado correctamente ✔️', error: false });
    } catch (error) {
      return res.status(500).json(`Algo ha ido mal: ${error.message}`);
    }
  }

  async deleteBoard(req, res) {
    const { boardID } = req.body;
    if (!boardID)
      return res.status(400).json({ message: 'Bad request', error: true });

    try {
      let deletedCount = boardsDAO.deleteBoard(boardID);
      if (!deletedCount) {
        return res.status(200).json({
          message: 'No se ha podido eliminar el tablero',
          error: true,
        });
      }

      return res.status(200).json({
        message: 'Tablero eliminado',
        error: false,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'No se ha podido eliminar el tablero',
        error: error.message,
      });
    }
  }

  async postTodoItems(req, res) {
    const { boardID, listID, todos } = req.body;
    if (!Array.isArray(todos) || todos.length === 0 || !boardID) {
      return res
        .status(400)
        .json({ message: 'Datos para añadir todo incompleto', error: true });
    }

    try {
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
      return res.status(500).json({
        message: 'No se han podido insertar los todos',
        error: error.message,
      });
    }
  }

  deleteTodo(req, res) {
    const { boardID, listID, todoID } = req.body;
    if (!boardID || isNaN(parseFloat(listID)) || isNaN(parseFloat(todoID)))
      return res.status(400).json({ message: 'Bad request', error: true });

    try {
      let deletedCount = boardsDAO.deleteTodo(boardID, listID, todoID);
      if (!deletedCount) {
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
      return res.status(500).json({
        message: 'No se ha podido eliminar la tarea',
        error: error.message,
      });
    }
  }

  editTodoTitle(req, res) {
    const { boardID, listID, todoID, title } = req.body;
    if (
      !boardID ||
      isNaN(parseFloat(listID)) ||
      isNaN(parseFloat(todoID)) ||
      typeof title !== 'string'
    ) {
      return res.status(400).json({ message: 'Bad request', error: true });
    }

    try {
      let modifiedCount = boardsDAO.editTodoTitle(
        boardID,
        listID,
        todoID,
        title
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
      return res.status(500).json({ message: error.message, error: true });
    }
  }

  editTodoIndex(req, res) {
    const { boardID, listID, todoID, index } = req.body;
    if (
      !boardID ||
      isNaN(parseFloat(listID)) ||
      isNaN(parseFloat(todoID)) ||
      isNaN(parseFloat(index))
    ) {
      return res.status(400).json({ message: 'Bad request', error: true });
    }

    try {
      let modifiedCount = boardsDAO.editTodoIndex(
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
      return res.status(500).json({ message: error.message, error: true });
    }
  }

  editTodoDescription(req, res) {
    const { boardID, listID, todoID, description } = req.body;
    if (
      !boardID ||
      isNaN(parseFloat(listID)) ||
      isNaN(parseFloat(todoID)) ||
      typeof description !== 'string'
    ) {
      return res.status(400).json({ message: 'Bad request', error: true });
    }

    try {
      let modifiedCount = boardsDAO.editTodoDescription(
        boardID,
        listID,
        todoID,
        description
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
      return res.status(500).json({ message: error.message, error: true });
    }
  }
}
export default new TablonController();
