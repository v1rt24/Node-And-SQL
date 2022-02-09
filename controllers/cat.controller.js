const db = require('../db'); // подключение к БД
const formatPrice = require('../utils/formatPrice');

class CatController {
    async getCategories(req, res) {
        try {
            const catId = req.query.id;
            const allCategories = await db.query('SELECT * FROM categories');
            const goodsData = await db.query('SELECT * FROM goods WHERE category_id = $1', [catId]);

            const dataPromise = await Promise.all([allCategories, goodsData]);

            const currentCategory = dataPromise[0].rows.find(el => el.id === +catId);

            for (const row of dataPromise[1].rows) {
                row.cost = formatPrice(row.cost);
            }

            res.render('cat', {
                title: `Категория ${currentCategory.category_name}`,
                allCategories: allCategories.rows,
                currentCategory,
                goods: dataPromise[1].rows,
                isActiveCatMenu: true,
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getOneCategory(req, res) {
    }

    async createCategory(req, res) {
        try {
            const {name, desc} = req.body;
            const newCategory = await db.query('INSERT INTO categories (category_name, description) values ($1, $2) RETURNING *', [name, desc]);
            res.json(newCategory.rows[0]);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateCategory(req, res) {
    }

    async deleteCategory(req, res) {
    }
}

module.exports = new CatController();