const db = require('../db'); // подключение к БД
const sendEmail = require('../utils/send.email');

class OrderController {
    async orderPage(req, res) {
        try {
            const keys = Object.keys(req.body).join(',');
            if (keys) {
                const resDb = await db.query(`SELECT * FROM goods WHERE id IN (${keys})`);
                res.json(resDb.rows);
            }

            res.render('order', {
                title: 'Заказ',
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async orderPageData(req, res) {
        try {
            const keys = Object.keys(req.body).join(',');
            if (keys) {
                const resDb = await db.query(`SELECT * FROM goods WHERE id IN (${keys})`);
                res.json(resDb.rows);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async finishOrder(req, res) {
        try {
            const parseCart = JSON.parse(req.body.cart);

            if (parseCart && Object.keys(parseCart).length > 0) {
                const INRes = Object.keys(parseCart).join(',');
                const resDb = await db.query('SELECT id, name, cost FROM goods WHERE id IN (' + INRes + ')');

                // await sendEmail({...req.body, cart: parseCart}, resDb.rows);
                await OrderController.saveOrder({...req.body, cart: parseCart}, resDb.rows);
                // res.send('1');
            } else {
                res.send('0');
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async saveOrder({name, tel, email, address, cart}, res) {
        try {
            const dbRes = await db.query(`
                INSERT INTO user_info (user_name, user_phone, user_email, address)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `, [name, tel, email, address]);

            const dataArr = res.map(item => {
                return `(${dbRes.rows[0].id}, ${item.id}, ${item.cost}, ${cart[item.id]}, ${item.cost * cart[item.id]})`;
            });

            const dbRes2 = await db.query(`
                INSERT INTO shop_order (user_id, goods_id, goods_cost, goods_amount, total)
                VALUES ${dataArr.join(',')}
                RETURNING id
            `);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = new OrderController();