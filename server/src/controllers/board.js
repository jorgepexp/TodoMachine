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
    const { boardID, document } = req.body;
    const validKeys = ['name', 'favorite'];

    try {
      if (!boardID || !validKeys.includes(Object.keys(document)[0]))
        return res.sendStatus(400);

      const modifiedCount = await boardsDAO.patchBoard(boardID, document);

      if (modifiedCount === 0) return res.sendStatus(400);

      return res.sendStatus(200);
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
    if (
      !boardID ||
      isNaN(parseFloat(listID)) ||
      !Array.isArray(todos) ||
      todos.length === 0
    )
      return res.sendStatus(400);

    try {
      const modifiedCount = await boardsDAO.postTodoItems(
        boardID,
        listID,
        todos
      );

      if (modifiedCount === 0) {
        return res.status(400).json({
          message: 'No se han podido insertar los todos',
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

  async deleteTodo(req, res) {
    const { boardID, listID, todoID } = req.body;
    if (!boardID || isNaN(parseFloat(listID)) || isNaN(parseFloat(todoID)))
      return res.sendStatus(400);

    try {
      const deletedCount = await boardsDAO.deleteTodo(boardID, listID, todoID);
      if (!deletedCount) {
        return res.status(400).json({
          message: 'No se ha podido eliminar la tarea',
        });
      }

      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json({
        message: 'No se ha podido eliminar la tarea',
        error: error.message,
      });
    }
  }

  async patchTodo(req, res) {
    const { boardID, listID, todoID, data } = req.body;
    const validDataKeys = ['title', 'index', 'description'];
    try {
      if (
        !boardID ||
        isNaN(parseFloat(listID)) ||
        isNaN(parseFloat(todoID)) ||
        !validDataKeys.includes(Object.keys(data)[0])
      ) {
        return res.sendStatus(400);
      }
      const modifiedCount = await boardsDAO.patchTodo(
        boardID,
        listID,
        todoID,
        data
      );

      if (modifiedCount === 0) return res.sendStatus(400);

      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json(`Algo ha ido mal: ${error.message}`);
    }
  }
}
export default new TablonController();
