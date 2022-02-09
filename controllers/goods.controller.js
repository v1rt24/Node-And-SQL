const db = require('../db'); // подключение к БД
const formatPrice = require('../utils/formatPrice');

class GoodsController {
    // Получение одного товара
    async getGoodsOne(req, res) {
        try {
            const nameGoods = req.params.name;
            const goods = await db.query('SELECT * FROM goods WHERE name = $1', [nameGoods]);

            if (!goods.rowCount) return res.redirect('/');

            goods.rows[0].cost = formatPrice(goods.rows[0].cost);

            res.render('goods', {
                title: nameGoods,
                goods: goods.rows[0],
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    // Получение товаров добавленных в корзину
    async goodsToCart(req, res) {
        try {
            const ids = req.body.join(',');
            const goodsData = await db.query(`SELECT id, name, cost FROM goods WHERE id IN (${ids})`);

            let goods = {};
            for (const item of goodsData.rows) {
                goods[item.id] = item;
            }

            res.json(goods);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = new GoodsController();