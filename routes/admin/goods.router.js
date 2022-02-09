// 1 Вариант
/*const Router = require('express');
const router = new Router();*/

// 2 Вариант
const {Router} = require('express');
const router = Router();

// Подключаем файл контроллера
const GoodsController = require('../../controllers/admin/goods.controller');

router.get('/', GoodsController.getGoods);

module.exports = router;