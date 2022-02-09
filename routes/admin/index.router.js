// 1 Вариант
/*const Router = require('express');
const router = new Router();*/

// 2 Вариант
const {Router} = require('express');
const router = Router();

// Подключаем файл контроллера
const IndexController = require('../../controllers/admin/index.controller');

// Запросы
router.get('/', IndexController.HomePage);

// Экспортируем
module.exports = router;