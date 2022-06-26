const express = require('express')
const app = express()
const bodyParser = require('body-parser');
var cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 3000;


//Config request
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Config database
var con = require('./config');
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
// Config func
var f = require('./function');
const res = require('express/lib/response');
const req = require('express/lib/request');
var func = new f(con);


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/user', (req, res) => {
    func.getUser(req, res)
})
app.post('/updateUser', (req, res) => {
    func.updateUser(req, res)
})
app.post('/updateUserPass', (req, res) => {
    func.updateUserPass(req, res)
})
app.get('/users', (req, res) => {
    func.getUsers(req, res)
})
app.post('/login', (req, res) => {
    func.login(req, res)
})
app.post('/addUser', (req, res) => {
    func.addUser(req, res);
})

app.get('/products', (req, res) => {
    func.getProducts(req, res)
})

app.get('/carts', (req, res) => {
    func.getCarts(req, res)
})
app.post('/cart', (req, res) => {
    func.addCart(req, res);
})
app.put('/removeCart', (req, res) => {
    func.removeCart(req, res);
})
app.post('/delCart', (req, res) => {
    func.delCart(req, res);
})
app.post('/updateCart', (req, res) => {
    func.updateCart(req, res);
})
app.get('/invoice', (req, res) => {
    func.getInvoice(req, res)
})
app.post('/addInvoice', (req, res) => {
    func.addInvoice(req, res);
})
app.post('/addInvoiceDetail', (req, res) => {
    func.addInvoiceDetail(req, res);
})
app.post('/addInvoice', (req, res) => {
    func.addInvoice(req, res);
})

app.post('/addInvoiceDetail', (req, res) => {
    func.addInvoiceDetail(req, res)
})

app.get('/product/search', (req, res) => {
    func.search(req, res)
})


app.enable('trust proxy');
server.listen(port, () => { console.log('Server started on: ' + port); });