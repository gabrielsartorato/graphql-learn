const { gql, ApolloServer } = require('apollo-server');

const produtos = [
  {
    id: 1,
    nome: 'Notebook',
    valor: 12000.00
  },
  {
    id: 2,
    nome: 'Tv',
    valor: 6000.00
  }
];

const usuarios = [
  {
    id: 1,
    nome: 'Gabriel',
    salario: 1980.00,
    ativo: true,
    idade: 26
  },
  {
    id: 2,
    nome: 'Joaquim',
    salario: 2500.00,
    ativo: false,
    idade: 30
  }
];

const db = [
  {
    id: 1,
    nome: 'Gabriel',
    email: 'gabriel@email.com',
    telefone: '11 9 8888 8888'
  },
  {
    id: 1,
    nome: 'Lucas',
    email: 'lucas@email.com',
    telefone: '11 8888 8888'
  },
];

const typeDefs = gql`

  type Produto {
    id: ID
    nome: String
    valor: Float
  }

  type Usuario {
    idade: String
    salario: Float
    nome: String
    ativo: Boolean
    id: ID
  }

  type Query {
    usuarios: [Usuario]
    produtos: [Produto]
    usuario(id: Int, nome: String): Usuario
  }
`;

const resolvers = {
  Query: {
    usuarios() {
      return usuarios;
    },
    usuario(_, args) {
      const { id, nome } = args;
      if (id) {
        return usuarios.find(usuario => usuario.id === id);
      }

      return usuarios.find(usuario => usuario.nome === nome);
    },
    produtos() {
      return produtos;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen();