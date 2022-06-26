const { response } = require("express");
const { use } = require("express/lib/application");
const moment = require("moment");

module.exports = function(con) {
    this.getProducts = function(req, res) {
        var sql = "SELECT * FROM products"
        con.query(sql, function(err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
    this.getUsers = function(req, res) {
        var sql = "SELECT * FROM user"
        con.query(sql, function(err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
    this.login = function(req, res) {
        console.log("ok");
        var sql = "SELECT * FROM user WHERE user_email=? and user_password= MD5(?)"
        con.query(sql, [req.body.user_email, req.body.user_password], function(err, result) {
            if (err) throw err;
            res.send(result);
        });
    }

    this.getUser = function(req, res) {
        var sql = "SELECT * FROM user WHERE user_id=?"
        con.query(sql, [req.query.user_id], function(err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
    this.updateUser = function(req, res) {
        var sql = "UPDATE user SET user_full_name=?, user_email=?, user_phone_number=?, user_address=? WHERE user_id=?"
        con.query(sql, [req.body.user_full_name, req.body.user_email, req.body.user_phone_number, req.body.user_address, req.body.user_id], function(err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
    this.updateUserPass = function(req, res) {
        var sql = "UPDATE user SET user_password=MD5(?) WHERE user_id=?"
        con.query(sql, [req.body.user_password, req.body.user_id], function(err, result) {
            if (err) throw err;
            res.send(result);
        });
    }

    this.getCarts = function(req, res) {
        var user_id = req.query.user_id
        var sql = "SELECT c.user_id,c.product_id,c.cart_product_size,c.cart_product_quantity,p.product_name,p.product_img,p.product_price FROM cart c LEFT JOIN  products p on c.product_id = p.product_id WHERE c.user_id = ?"
        con.query(sql, [user_id], function(err, result) {
            if (err) throw err;
            res.send(result)
        })
    }
    this.addCart = function(req, res) {
        var user_id = req.body.user_id
        var product_id = req.body.product_id
        var cart_product_size = req.body.cart_product_size
        var cart_product_quantity = req.body.cart_product_quantity
        var sql = "INSERT INTO cart(user_id, product_id, cart_product_size, cart_product_quantity) VALUES (?,?,?,?)"
        con.query(sql, [user_id, product_id, cart_product_size, cart_product_quantity], function(err, result) {
            if (err) throw err;
            res.send(result)
        })
    }
    this.delCart = function(req, res) {
        var user_id = req.body.user_id
        var product_id = req.body.product_id
        var cart_product_size = req.body.cart_product_size
        var sql = "DELETE FROM cart WHERE user_id = ? AND product_id = ? AND cart_product_size = ?"
        con.query(sql, [user_id, product_id, cart_product_size], function(err, result) {
            if (err) throw err;
            res.send(result)
        })
    }
    this.updateCart = function(req, res) {
        var sql = "UPDATE cart SET cart_product_quantity = ? WHERE user_id = ? AND product_id = ? AND cart_product_size = ?"
        con.query(sql, [req.body.cart_product_quantity, req.body.user_id, req.body.product_id, req.body.cart_product_size], function(err, result) {
            if (err) throw err;
            res.send(result);
        });
    }
    this.addUser = function(req, res) {
        var user_full_name = req.body.user_full_name
        var user_email = req.body.user_email
        var user_password = req.body.user_password
        var user_phone_number = req.body.user_phone_number
        var user_address = req.body.user_address
        var sql = "INSERT INTO user(user_full_name, user_email, user_password, user_phone_number,user_address) VALUES (?,?,MD5(?),?,?)"
        con.query(sql, [user_full_name, user_email, user_password, user_phone_number, user_address], function(err, result) {
            if (err) throw err;
            res.send(result)
        })
    }
    this.getInvoiceDetails = function(invoice_id) {
        return new Promise(resolve => {
            var sql = "SELECT I.invoice_id,I.detail_product_quantity, I.detail_product_size, P.* FROM invoice_detail I LEFT JOIN products P ON I.product_id = P.product_id WHERE invoice_id = ?"
            con.query(sql, [invoice_id], function(err, result) {
                if (err) throw err;
                resolve(result);
            })
        })
    }
    this.getInvoice = async function(req, res) {
        var user_id = req.query.user_id;
        if (user_id != null) {
            var getInvoiceDetails = this.getInvoiceDetails;
            var sql = "SELECT * FROM invoice WHERE user_id = ?"
            con.query(sql, [user_id], async function(err, result) {
                if (err) throw err;
                var list = []
                i = 0
                if (result.length > 0) {
                    for (let index = 0; index < result.length; index++) {
                        var temp = result[index]['invoice_created_at'];
                        console.log(temp);
                        result[index]['invoice_created_at'] = moment(temp).format('YYYY-MM-DD');
                        var element = result[index]
                        var lsDetails = await getInvoiceDetails(element.invoice_id)
                        if (lsDetails.length > 0) {
                            list.push(element)
                            list[i++]['list_details'] = lsDetails;
                        }
                    }
                    res.send(list)
                } else {
                    res.send([])
                }
            })
        } else {
            res.send([])
        }
    }

    this.addInvoice = function(req, res) {
        var user_id = req.body.user_id
        var invoice_total_payment = req.body.invoice_total_payment
        var invoice_created_at = req.body.invoice_created_at
        var sql = "INSERT INTO invoice(user_id,invoice_total_payment, invoice_created_at) VALUES (?,?,?)"
        con.query(sql, [user_id, invoice_total_payment, invoice_created_at], function(err, result) {
            if (err) throw err;
            res.send(result)
        })
    }
    this.addInvoiceDetail = function(req, res) {
        var detail_product_quantity = req.body.detail_product_quantity
        var detail_product_size = req.body.detail_product_size
        var product_id = req.body.product_ids
        var invoice_id = req.body.invoice_id
        var sql = "INSERT INTO invoice_detail(invoice_id,product_id,detail_product_quantity,detail_product_size) VALUES (?,?,?,?)"
        con.query(sql, [invoice_id, product_id, detail_product_quantity, detail_product_size], function(err, result) {
            if (err) throw err;
            res.send(result)
        })
    }

    this.removeCart = function(req, res) {
        var user_id = req.body.user_id;
        var sql = "DELETE FROM cart WHERE user_id = ?"
        con.query(sql, [user_id], function(err, result) {
            if (err) throw err;
            res.send(result)
        })
    }

    this.addInvoice = function(req, res) {
        var user_id = req.body.user_id;
        var invoice_total_payment = req.body.invoice_total_payment;
        var invoice_created_at = req.body.invoice_created_at;
        var sql = "INSERT INTO invoice( user_id, invoice_total_payment, invoice_created_at) VALUES ( ?,?,?)"
        con.query(sql, [user_id, invoice_total_payment, invoice_created_at], function(err, result) {
            if (err) throw err;
            res.send(result)
        })
    }

    this.addInvoiceDetail = function(req, res) {
        var invoice_id = req.body.invoice_id;
        var product_id = req.body.product_id;
        var detail_product_quantity = req.body.detail_product_quantity;
        var detail_product_size = req.body.detail_product_size;
        var sql = "INSERT INTO invoice_detail (invoice_id, product_id, detail_product_quantity, detail_product_size) VALUES (?,?,?,?)"
        con.query(sql, [invoice_id, product_id, detail_product_quantity, detail_product_size], function(err, result) {
            if (err) throw err
            res.send(result)
        })
    }
    this.search = function(req, res) {
        var sql = 'SELECT * FROM products WHERE product_name LIKE "%' + req.query.q + '%" order by products.product_name'
        con.query(sql, function(err, result) {
            if (err) throw err;
            res.send(result);
        });
        console.log(sql)
    }

}