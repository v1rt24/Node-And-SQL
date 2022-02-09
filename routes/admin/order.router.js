// 1 Вариант
/*const Router = require('express');
const router = new Router();*/

// 2 Вариант
const {Router} = require('express');
const router = Router();

// Подключаем файл контроллера
const OrderController = require('../../controllers/admin/order.controller');

router.get('/', OrderController.getOrders);

module.exports = router;