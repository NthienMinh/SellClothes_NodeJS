const mysql = require('mysql');
var con = mysql.createConnection({
    host: "pma.phatdev.xyz",
    user: "phatdevx_fteam_clothes",
    password: "fteam_clothes",
    database: "phatdevx_fteam_clothes",
});
module.exports = con;