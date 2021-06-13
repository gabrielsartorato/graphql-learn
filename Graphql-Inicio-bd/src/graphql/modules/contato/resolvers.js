// const usuarioCadastroService = require('../../../services/UsuarioCadastroService');

module.exports = {
  Query: {
    contatos: async (obj, args, { usuarioCadastroService }, info) => await usuarioCadastroService.contatos(),    
  },
  Mutation: {
    criarContato: async (_, { data }, { usuarioCadastroService }) => {
      return await usuarioCadastroService.criarContato(data)
    },
    atualizarContato: async (_, { id, data }, { usuarioCadastroService }) => {
      return await usuarioCadastroService.atualizarContato(id, data)
    },
    deletarContato: async (_, { filtro }, { usuarioCadastroService }) => {
      return await usuarioCadastroService.deletarContato(filtro)
    },
  },
}