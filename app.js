const express = require('express');
const homeRouter = require('./routes/home.router'); // подключаем роутер главной страницы
const catRouter = require('./routes/cats.router'); // подключаем роутер категорий
const goodsRoute = require('./routes/goods.router'); // подключаем роутер товаров
const orderRoute = require('./routes/order.router'); // подключаем роутер заказа
const homeAdmin = require('./routes/admin/index.router'); // подключаем роутер админки
const orderAdmin = require('./routes/admin/order.router'); // подключаем роутер админки заказов
const goodsAdmin = require('./routes/admin/goods.router'); // подключаем роутер админки товаров
const exphbs = require('express-handlebars'); // подключаем плагин
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Указываем настройки
const hbs = exphbs.create({
    defaultLayout: 'main', // прописываем название шаблона, который создаём в папке layouts/main.hbs
    extname: 'hbs', // прописываем расширение файлов, которое будем использовать. По умолчанию handlebars
});

// Регистрируем модуль
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); // 'hbs' название должно совпадать с названием которое прописали в "app.engine"
app.set('views', 'views'); // второй 'views' это название папки, в которой будут находиться все наши шаблоны

// Для обработки json
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Подключение статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Регистрируем роуты/маршруты
app.use('/', homeRouter);
app.use('/cat', catRouter);
app.use('/goods', goodsRoute);
app.use('/order', orderRoute);
app.use('/admin', homeAdmin);
app.use('/admin/order', orderAdmin);
app.use('/admin/goods', goodsAdmin);

// Запускаем сервер
app.listen(PORT, error => {
    error
        ? console.log(error)
        : console.log(`Сервер запущен на порту: http://localhost:${PORT}`);
});