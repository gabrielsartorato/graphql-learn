const db = require('../db');

class UsuarioCadastroService {
  constructor(service) {
    this.service = service
  }

  contatos = async () => {
    return await this.service('contatos');
  }

  criarContato = async (data ) => {
    return await (await this.service('contatos').insert(data).returning('*'))[0];
  }

  atualizarContato = async (id, data) => {
    return await (await this.service('contatos').where({ id }).update(data).returning('*'))[0]
  }
    
  deletarContato = async (filtro ) => {
    if (filtro.id) {
      return await this.service('contatos').where({ id: filtro.id}).delete();
    }

    if (filtro.email) {
      return await this.service('contatos').where({ email: filtro.email}).delete();
    }

    return new Error('Favor passar um parâmetro!');
  }
}

module.exports = new UsuarioCadastroService(db);