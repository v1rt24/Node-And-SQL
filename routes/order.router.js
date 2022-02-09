// 1 Вариант
/*const Router = require('express');
const router = new Router();*/

// 2 Вариант
const {Router} = require('express');
const router = Router();

const orderController = require('../controllers/order.controller');

router.get('/', orderController.orderPage);
router.post('/', orderController.orderPageData);
router.post('/finish-order', orderController.finishOrder);

module.exports = router;