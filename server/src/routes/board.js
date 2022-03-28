import express from 'express';
import BoardController from '../controllers/board.js';
import ListController from '../controllers/list.js';
// import { verifyJWT } from '../middlewares/verifyJWT.js';
const router = express.Router();

router
  .route('/')
  .post(BoardController.postBoard)
  .patch(BoardController.patchBoard)
  .delete(BoardController.deleteBoard);

router.route('/:id').get(BoardController.getBoard);

router
  .route('/list')
  .post(ListController.postList)
  .patch(ListController.patchList)
  .delete(ListController.deleteList);

router
  .route('/todos')
  .post(BoardController.postTodoItems)
  .delete(BoardController.deleteTodo)
  .patch(BoardController.patchTodo);

export default router;
