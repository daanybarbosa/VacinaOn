const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: Number, required: true },
  ddd: { type: Number, required: true },
  celular: { type: Number, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  //Validar login 
  async login() {
    this.valida();
    if(this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if(!this.user) {
      this.errors.push('Usuário não existe.');
      return;
    }

    if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

  // Registrar usuario 
  async register() {
    this.valida();
    if(this.errors.length > 0) return;

    await this.userExists();

    if(this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  // Verificar se o usuario já existe
  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if(this.user) this.errors.push('Usuário já existe.');
  }

  // Validação
  valida() {
    this.cleanUp();

    /*
    // CPF precisa ser válido 
    if(this.body.cpf.length < 10 || this.body.cpf.length > 12) {
      this.errors.push('CPF inválido');
    }

    // ddd precisa ser válido 
    if(this.body.ddd.length < 1 || this.body.cpf.length > 4) {
      this.errors.push('DDD inválido');
    }

    // celular precisa ser válido 
    if(this.body.celular.length < 7 || this.body.cpf.length > 10) {
      this.errors.push('Celular inválido');
    }
*/
    // O e-mail precisa ser válido
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

    // A senha precisa ter entre 3 e 50
    if(this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() {
    for(const key in this.body) {
      if(typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      nome: this.body.nome,
      cpf: this.body.cpf,
      ddd: this.body.ddd,
      celular: this.body.celular,
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;
