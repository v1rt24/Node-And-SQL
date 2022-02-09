const db = require('../../db'); // подключение к БД
const formatPrice = require('../../utils/formatPrice');
const formatDate = require('../../utils/formatDate');

class OrderController {
    async getOrders(req, res) {
        try {
            // const resDb = await db.query('SELECT * FROM shop_order ORDER BY date DESC');
            const resDb = await db.query(`
                SELECT 
                shop_order.id AS shoporder_id, 
                shop_order.user_id, 
                shop_order.goods_id, 
                shop_order.goods_cost, 
                shop_order.goods_amount, 
                shop_order.total, 
                shop_order.date,
                user_info.id AS userinfo_id,
                user_info.user_name,
                user_info.user_phone,
                user_info.user_email,
                user_info.address
                FROM shop_order
                JOIN user_info ON shop_order.user_id = user_info.id;
            `);

            let allCount = 0;
            let allCost = 0;

            for (const resDbElement of resDb.rows) {
                allCount += +resDbElement.goods_amount;
                allCost += +resDbElement.total;

                resDbElement.goods_cost = formatPrice(resDbElement.goods_cost);
                resDbElement.total = formatPrice(resDbElement.total);
                resDbElement.date = formatDate(resDbElement.date, 'datetime');
            }

            res.render('admin/order', {
                title: 'Все заказы',
                layout: 'admin',
                orders: resDb.rows,
                allCount,
                allCost: formatPrice(allCost),
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = new OrderController();