const db = require('./queries')

const express = require('express')
const bodyParser = require('body-parser')
let ejs = require('ejs');
const app = express()
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views/'));
var session = require('express-session')

app.set('trust proxy', 1)
app.use(session({
  secret: 'secret',
  resave: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 365 * 1000
  }
}))

const port = 3000

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', function(req, res) {
  if (req.session.user != undefined) {
    res.redirect('/admin/home');
    return;
  }


  res.render('login', {user: req.session.user, error: req.query.error, success:{}});
});

app.get('/admin/home', function(req, res) {
  res.render('index', {user: req.session.user, errors: {}, success:{}});
});



app.get('/login/logout', function(req, res) {
  req.session.user = undefined;
  res.redirect('/');
});



app.post('/login/register', db.createUser)
app.post('/login/logar', db.logar)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})