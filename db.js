const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres', // пользователь
    password: '111111', // пароль
    host: 'localhost',
    port: 5432,
    database: 'nodejs', // название БД
});

module.exports = pool;