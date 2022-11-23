const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();


const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Senha@321',
    database: 'consultorio'
});
connection.connect(function (error) {
    if (!!error) console.log(error);
    else console.log('Database Connected!');
});


//set views file
app.set('views', path.join(__dirname, 'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    let sql = "SELECT * FROM medicos";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('user_index', {
            title: 'Crud Medico',
            medico: rows
        });
    });
})

app.get('/add', (req, res) => {
    res.render('user_add', {
        title: 'Crud Medico'
    });
});

app.post('/save', (req, res) => {
    let data = { 
        nome: req.body.nome, 
        cpf: req.body.cpf, 
        rg: req.body.rg, 
        crm: req.body.crm, 
        endereco: req.body.endereco, 
        telefone: req.body.telefone, 
        sexo: req.body.sexo, 
    };
    let sql = `INSERT INTO medicos SET ?`;
    let query = connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:medicoId',(req, res) => {
    const medicoId = req.params.medicoId;
    let sql = `Select * from medicos where id = ${medicoId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title: 'Crud Medico',
            medico : result[0]
        });
    });
});
app.post('/update',(req, res) => {
    const medicoId = req.body.id;
    let sql = "update medicos SET nome='"+req.body.nome+"',  cpf='"+req.body.cpf+"',  rg='"+req.body.rg+"'crm='"+req.body.crm+"',  endereco='"+req.body.endereco+"', telefone='"+req.body.telefone+"', sexo='"+req.body.sexo+"',where id ="+medicoId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


app.get('/delete/:medicosId',(req, res) => {
    const medicosId = req.params.medicosId;
    let sql = `DELETE from medicos where id = ${medicosId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// Server Listening
app.listen(8080);