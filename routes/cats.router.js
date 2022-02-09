// 1 Вариант
/*const Router = require('express');
const router = new Router();*/

// 2 Вариант
const {Router} = require('express');
const router = Router();

// Подключаем файл контроллера
const catController = require('../controllers/cat.controller');

// Запросы
router.get('/', catController.getCategories);
router.get('/:id', catController.getOneCategory);
router.post('/', catController.createCategory);
router.put('/', catController.updateCategory);
router.delete('/:id', catController.deleteCategory);

// Экспортируем
module.exports = router;