var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
  
  
// Default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'Hallo' })
});
// Konfigurasi koneksi
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'api_nopdejs'
});
  
// Koneksi ke database
dbConn.connect(); 
 
 
// Menampilkan data all user
app.get('/users', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'List data users.' });
    });
});
 
 
// Menampilkan data user detail
app.get('/user/:id', function (req, res) {
  
    let user_id = req.params.id;
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Silakan isikan parameter user_id' });
    }
  
    dbConn.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'Detail list users.' });
    });
  
});
 
 
// Menambahkan user baru 
app.post('/user', function (req, res) {
  
    let user = req.body.user;
  
    if (!user) {
        return res.status(400).send({ error:true, message: 'Silakan isikan parameter user' });
    }
  
    dbConn.query("INSERT INTO users SET ? ", { user: user, name: req.body.name, email: req.body.email }, function (error, results, fields) {
        if (error) throw error;
        return res.status(201).send({ error: false, data: results, message: 'User baru berhasil ditambahkan.' });
    });
});

 
//  Update detail user id
app.put('/user', function (req, res) {
  
    let user_id = req.body.user_id;
    let user = req.body.user;
    let name = req.body.name;
    let email = req.body.email;
  
    if (!user_id || !user) {
        return res.status(400).send({ error: user, message: 'Silakan isikan parameter user dan user_id' });
    }
  
    dbConn.query("UPDATE users SET user = ?, name = ?, email = ? WHERE id = ?", [user, name, email, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Data user berhasil diperbaharui.' });
    });
});
 
 
//  Delete user
app.delete('/user', function (req, res) {
  
    let user_id = req.body.user_id;
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Silakan isikan parameter user_id' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User berhasil dihapus.' });
    });
}); 
 
// Set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;