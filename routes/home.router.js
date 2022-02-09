// 1 Вариант
/*const Router = require('express');
const router = new Router();*/

// 2 Вариант
const {Router} = require('express');
const router = Router();

const homeController = require('../controllers/home.controller');

router.get('/', homeController.getGoods);

module.exports = router;