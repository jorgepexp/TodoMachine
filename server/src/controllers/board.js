import boardsDAO from '../dao/boardsDAO.js';

class TablonController {
  async getBoard(req, res) {
    const id = req.params.id;
    let boards;

    if (!id || typeof id !== 'string') return res.sendStatus(400);

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
    if (!name || !ownerID) return res.sendStatus(400);

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
    if (!boardID || (!name && typeof name !== 'string'))
      return res.sendStatus(400);

    try {
      const modifiedCount = await boardsDAO.patchBoard(boardID, name);

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
    if (!boardID) return res.sendStatus(400);

    try {
      const deletedCount = boardsDAO.deleteBoard(boardID);
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
    if (!boardID || !listID || !Array.isArray(todos) || todos.length === 0)
      return res.sendStatus(400);

    try {
      const modifiedCount = await boardsDAO.postTodoItems(
        boardID,
        listID,
        todos
      );

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
      return res.sendStatus(400);

    try {
      const deletedCount = boardsDAO.deleteTodo(boardID, listID, todoID);
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

  async patchTodo(req, res) {
    const { boardID, listID, todoID, document } = req.body;
    const validKeys = ['title', 'index', 'description'];
    try {
      console.log(req.body);

      if (
        !boardID ||
        isNaN(parseFloat(listID)) ||
        isNaN(parseFloat(todoID)) ||
        !(document?.keys[0] in validKeys)
      ) {
        return res.sendStatus(400);
      }

      const modifiedCount = await boardsDAO.patchTodo(
        boardID,
        listID,
        todoID,
        document
      );

      if (modifiedCount === 0) return res.sendStatus(400);

      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json(`Algo ha ido mal: ${error.message}`);
    }
  }
}
export default new TablonController();
