const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vacina',
  password: '123456',
  port: 5432,
});

const logar = (request, response) => {
    let user = request.body;
  
    pool.query('SELECT * FROM USUARIO WHERE email = $1 and senha = $2 LIMIT 1', 
        [user.email, user.password], (error, results) => {
      if (error) {
        throw error
      }

      if (results.rows.length > 0) {
        request.session.user = results.rows[0]; 
        response.redirect('/admin/home');
        return;
      }

      response.redirect('/?error=true');
      return;
    })
}

const createUser = (request, response) => {
    let user = request.body

    pool.query('INSERT INTO usuario(nome, cpf, celular, email, senha) VALUES ($1, $2, $3, $4, $5)', [user.name, user.cpf, user.celular, user.email, user.password], (error, results) => {
      if (error) {
        throw error
      }

      response.status(201)
    })
}

module.exports = {
    createUser,
    logar
}