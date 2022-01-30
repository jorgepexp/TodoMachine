import express from 'express';
import BoardController from '../controllers/board.js';
import ListController from '../controllers/list.js';
const router = express.Router();

router.route('/').post(BoardController.postBoard);
router.route('/').patch(BoardController.patchBoard);
router.route('/').delete(BoardController.deleteBoard);
router.route('/:id').get(BoardController.getBoard);

router.route('/list').post(ListController.postList);
router.route('/list').put(ListController.editList);
router.route('/list').delete(ListController.deleteList);

router.route('/todos').post(BoardController.postTodoItems);
router.route('/todos/title').put(BoardController.editTodoTitle);
router.route('/todos/description').put(BoardController.editTodoDescription);
router.route('/todos/index').put(BoardController.editTodoIndex);
router.route('/todos').delete(BoardController.deleteTodo);

export default router;
