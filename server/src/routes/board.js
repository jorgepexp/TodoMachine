import express from 'express';
import BoardController from '../controllers/board.js';
const router = express.Router();

router.route('/').post(BoardController.postBoard);
router.route('/:id').get(BoardController.getBoard);

router.route('/list').post(BoardController.postList);
router.route('/list').put(BoardController.editList);
router.route('/list').delete(BoardController.deleteList);

router.route('/todos').post(BoardController.postTodoItems);
router.route('/todos').put(BoardController.editTodo);
router.route('/todos').delete(BoardController.deleteTodo);

export default router;
