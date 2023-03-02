const { Pool } = require('pg');

const pool = new Pool ({
    host: 'localhost',
    port: 5000,
    user: 'postgres',
    password: 'tretAdo66',
    database: 'dindin'

})

module.exports = pool;