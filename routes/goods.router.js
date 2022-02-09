// 1 Вариант
/*const Router = require('express');
const router = new Router();*/

// 2 Вариант
const {Router} = require('express');
const router = Router();

// Подключаем файл контроллера
const goodsController = require('../controllers/goods.controller');

// Запросы
router.get('/:name', goodsController.getGoodsOne); // Получение одного товара
router.post('/goods-cart', goodsController.goodsToCart); // Получение товаров добавленных в корзину

// Экспортируем
module.exports = router;