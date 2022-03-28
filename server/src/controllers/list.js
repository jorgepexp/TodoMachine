import boardsDAO from '../dao/boardsDAO.js';
class ListController {
  async postList(req, res) {
    let { boardID, listID, name, index, todos = null } = req.body;

    if (
      !boardID ||
      isNaN(parseFloat(listID)) ||
      !name ||
      isNaN(parseFloat(index))
    )
      return res.sendStatus(400);

    try {
      const listData = { boardID, listID, name, index, todos };
      let modifiedCount = await boardsDAO.postList(listData);
      if (modifiedCount === 0) {
        return res.status(400).json({
          message: 'No se ha podido insertar la lista',
        });
      }

      return res.sendStatus(201);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async patchList(req, res) {
    const { boardID, listID, data } = req.body;
    const validDataKeys = ['index', 'name'];
    if (
      isNaN(parseFloat(listID)) ||
      !boardID ||
      !validDataKeys.includes(Object.keys(data)[0])
    ) {
      return res.sendStatus(400);
    }

    try {
      let modifiedCount = await boardsDAO.patchList(boardID, listID, data);

      if (modifiedCount === 0) return res.sendStatus(400);

      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteList(req, res) {
    const { boardID, listID } = req.body;
    if (isNaN(parseFloat(listID)) || !boardID) return res.sendStatus(400);

    try {
      let deletedCount = await boardsDAO.deleteList(boardID, listID);

      if (deletedCount === 0) {
        return res.status(400).json({
          message: 'No se ha podido eliminar la lista',
        });
      }

      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json({
        message: `No se ha podido eliminar la lista: ${error.message}`,
      });
    }
  }
}

export default new ListController();
