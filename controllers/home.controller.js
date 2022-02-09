const db = require('../db'); // подключение к БД
const formatPrice = require('../utils/formatPrice');

class HomeController {
    async getGoods(req, res) {
        try {
            const catDb = await db.query('SELECT * FROM categories');
            const goodsDb = await db.query(`
                (SELECT id, name, cost, image, category_id FROM goods WHERE category_id = 1 LIMIT 3)
                UNION
                (SELECT id, name, cost, image, category_id FROM goods WHERE category_id = 2 LIMIT 3)
            `);

            const resData = await Promise.all([catDb, goodsDb]);

            // console.log(resData[0].rows);
            // console.log(resData[1].rows);

            for (const item of resData[1].rows) {
                item.cost = formatPrice(item.cost);
            }

            res.render('index', {
                title: 'Главная',
                cats: resData[0].rows,
                goods: resData[1].rows,
                isActiveHomeMenu: true,
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = new HomeController();