const { gql, ApolloServer } = require('apollo-server');

const db = [
  {
    id: 1,
    nome: 'Gabriel',
    email: 'gabriel@email.com',
    telefone_fixo: '11 9 8888 8888',
    perfil: 1,
  },
  {
    id: 2,
    nome: 'Lucas',
    email: 'lucas@email.com',
    telefone_fixo: '11 8888 8888',
    perfil: 2
  },
];

const perfis = [
  { id: 1, descricao: 'Admin' },
  { id: 2, descricao: 'Normal' }
];

const typeDefs = gql`
  type Usuario {
    id: Int
    nome: String
    email: String
    telefone: String
    perfil: Perfil
  }

  type Perfil {
    id: Int
    descricao: String
  }

  type Query {
    usuario(id: Int): Usuario
    perfis: [Perfil]
  }
`;

const resolvers = {
  Usuario: {
    telefone(obj) {
      return obj.telefone_fixo;
    },
    perfil(usuario) {
      return perfis.find(perfil => perfil.id === usuario.perfil);
    }
  },
  Query: {
    usuario(_, args) {
      return db.find(db => db.id === args.id);
    },
    perfis() { 
      return perfis;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen();