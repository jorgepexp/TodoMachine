import boardsDAO from '../dao/boardsDAO.js';
class ListController {
  async postList(req, res) {
    let { boardID, listID, name, index, todos = null } = req.body;

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

    try {
      const listData = { boardID, listID, name, index, todos };
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
      return res.status(500).json({ message: error.message, error: true });
    }
  }

  async editList(req, res) {
    const { boardID, listID, index, name } = req.body;
    if (isNaN(parseFloat(listID)) || !boardID) {
      return res.status(400).json({
        message: 'Faltan datos para editar el nombre de la lista',
        error: true,
      });
    }

    try {
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
      return res.status(500).json({ message: error.message, error: true });
    }
  }

  async deleteList(req, res) {
    const { boardID, listID } = req.body;
    if (isNaN(parseFloat(listID)) || !boardID)
      return res.status(400).json({ message: 'Bad request', error: true });

    try {
      let deletedCount = await boardsDAO.deleteList(boardID, listID);

      if (deletedCount === 0) {
        return res.status(200).json({
          message: 'No se ha podido eliminar la lista',
          error: true,
        });
      }

      return res.status(200).json({
        message: 'Documento eliminado',
        error: false,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'No se ha podido eliminar la lista',
        error: error.message,
      });
    }
  }
}

export default new ListController();
