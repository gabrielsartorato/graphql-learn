# GraphQL

O que é?

O GraphQL é uma linguagem de pesquisa para suas API. Veio para resolver alguns problemas do Rest, basicamente você pede o que vc quer e terá como resultado somente o que foi pedido.

## Ferramentas necessárias para se usar com NodeJS

- yarn add graphql apollo-server

## Scalar Types

Scalar types são os tipos de dados que o GraphQL suportam, dentro deles estão:

- Int
- Float
- String
- Boolean
- ID

## TypeDefs e Resolver

TypeDefs é usado para definir os tipos de querys que podem ser pesquisadas.
Resolvers é usado para resolver as querys recebidas, eles devem manter o mesmo nome dado dentro das definições de tipos (typeDefs) resolvendo a consulta que lhe foi solicitada.

## Tratamento de no-null

Dentro do typeDefs para que obrique o GraphQL a retornar um Algo não nulo, na frente da sua definição coloque um !, assim forçara o retorno a ser do tipo definido, ex: [String]!, quando realmente queremos que seja do tipo definido, colocamos o ! também para obrigar a ser daquele tipo ficando assim ex: [String!]!

## Tratamento de erros

Quando lançado um erro, podemos formata-lo antes de envia-lo de volta ao cliente, dentro do ApolloServer criado no index, existe a função formatError() que é usada da seguinte forma, ex:

```js
formatError: (err) => {
  if (err.message.startsWith('Usuário já existente:')) {
    return new Error(err.message);
  }
}
```

## Object Types

São objetos definidos dentro de typDefs para possiveis buscas, ex:

```js
  type Usuario {
      idade: String
      salario: Float
      nome: String
      ativo: Boolean
      id: ID
  }
```

## Parâmetros dentro de uma consulta

O GraphQL nos permite passar parâmetros dentro de uma consulta para uma melhor filtragem, ex:

- O primeiro argumentos recebido é o obj de retorno já o segundo são os argumentos passados pela query.

```js
  const typeDefs = gql`
    type Query {
      usuario(id: Int): Usuario
    }
  `;

  const resolver = {
    Query: {
      usuario(_, args) {
        return db.find(db => db.id === args.id);
      },
    }
  };
```

## Alias e Fragments

- Alias é usado para dar um apelido a consulta quando forem feitas duas da mesma consultas só que com paramêtros diferentes, ex:

```js
query {
  primeiroUsuario: usuario(id: 1) {
    id 
    nome
    email
    telefone
    perfil {
      id
      descricao
    }
  }

  segundaUsuario: usuario(id: 2) {
    id 
    nome
    email
    telefone
    perfil {
      id
      descricao
    }
  }
}
```

- Já o fragment é usado quando você quer usar as mesmas propriedades em várias consultas sem ter que repetilas, ex:

```js
primeiroUsuario: usuario(id: 1) {
  ...usuarioCompleto
}

segundoUsuario: usuario(id: 1) {
  ...usuarioCompleto
}

fragment usuarioCompleto on Usuario {
  id 
  nome
  email
  telefone
  perfil {
    id
    descricao
  }
}
```

## OperationName

OperationName é usado para dar nome as operações para melhores validações caso haja erro devido mostrar diretamente qual query está com problema, ex:

```js
  query pedidoVenda {

  }
```

## Enums

São tipagens estáticas usada para forçar e verificar algum tipo de retorno está igual ao que foi solicitado, ex:

```js
typeDefs gql`
  enum TipoPerfil {
    ADMIN
    NORMAL
  }

  type Perfil {
    id: Int
    descricao: TipoPerfil
  }
`
```

## Variavéis

Usadas para receber parâmetros de pesquisa em suas querys, ex:

```js
query pesquisaUsuario($id: Int) {
  usuario(id: $id) {
    nome 
    email
  }
}
```

## Diretivas

Usadas para condicionais no tratamento de retorno dos dados, existem dois tipos de diretivas, a @include e a @skip.

- A @include é usada como condicional para saber se vai ser devolvido ou não como resultado, recebendo valor booleano (true ou false).
- A @skip é usada como condicional para saber se vai ser incluída ou não no retorno dos dados.

```js
query pesquisaUsuario($id: Int, $comPerfil: Boolean!, $pular: Boolean!) {
  usuario(id: $id) {
    nome email
    telefone @skip(if: $pular)
    perfil @include(if: $comPerfil) {
      id descricao
    }
  }
}
```

## Mutations

Mutations são usadas para as criações de objetos, ex:

```js
/*
  Criamos ela dentro da definição de tipos com seu nome e seus argumentos que são recebidos
  E logo após informamos o tipo de retorno sendo que é obrigatório usando o !
*/
type Mutation {
  criarUsuario(nome: String, email: String, telefone: String): Usuario!
}

/*
  Como toda definição de tipo necessita de um resolver, não é diferente com as mutations
  Em nosso resolver colocamos o mesmo nome que foi definido na Definição de tipos
  E também colocamos todas as tratativas necessárias e um retorno.
*/

Mutation: {
  criarUsuario(_, args) {
    const { email } = args;

    const usuarioExistente = db.usuarios.some((u) => u.email === email);

    if (usuarioExistente) {
      throw new Error(`Usuário já existente: ${args.nome}`);
    }

    const novoUsuario = {
      ...args,
      id: geradorDeId(db.usuarios),
      perfil: 2,
    }

    db.usuarios.push(novoUsuario);

    return novoUsuario;
  }
}
```

## Type Input

TypeInput é usado para reuso de propriedades que estão sendo repetidas, ex:

```js
input UsuarioInput {
  nome: String
  email: String
  telefone: String
}
```

## Context e DataSource

Context e DataSource podem ser usadas para receber serviços/autenticação para que possam ser passados e usados nas querys ou mutations que recebem em seu terceiro parâmetro, ex:

```js
const server = new ApolloServer({
  ...graphql,
  context: () => ({
    // instânciando um contexto
    usuarioCadastroService: UsuarioCadastroService
  })
});

// uso dentro de uma Mutation
Mutation: {
  criarContato: async (_, { data }, { usuarioCadastroService }) => {
    return await usuarioCadastroService.criarContato(data)
  }
},

```

## Appolo-Client

### useQuery(): usado para fazer chamadas das query de consultas

- Primeiro preparamos a query de consulta;
  
```js
export const GET_CONTATOS = gql`
  query {
    contatos {
      id
      nome
      email
      telefone
    }
  }
`;
```

- Em seguida fazemos o uso do hook com a consulta que queremos:

```js
const { data, loading, error, refetch } = useQuery(GET_CONTATOS);
```

Podem ser retornados:

- data: dados do retorno da chamada;
- loading: enquanto os dados não são retornados seu estado fica como false
- error: caso haja algum erro é retornado

```js
function handleSubmit(event) {
  event.preventDefault();

  contatos.criarContato({
    variables: inputs,
  });

  contatos.refetch();
  setInputs(valorInicial);
}
```

No exemplo acima após ser enviado os dados, a função refetch() é chamada para fazer um reuso da query.

### useMutatio() usado para fazer as mutation

Primeiro é criamos nossa mutation, passando nossas váriaveis.

```js
export const ADD_CONTATO = gql`
  mutation criarContato($nome: String, $email: String, $telefone: String) {
    criarContato(data: { nome: $nome, email: $email, telefone: $telefone }) {
      id
      nome
      email
      telefone
    }
  }
`;
```

Modo de usar:

Ele retorna uma array, na primeira posição ele retorna uma função e na segunda posição um objeto associado a sua consulta (mesmos objetos retornados de uma useQuery).

Dentro do useMutation, ele recebe um segundo parâmetro um objeto, dentro temos a propriedade updade().

Dentro de update temos o cache e um segundo parâmetro que é um objeto, nele temos o retorno pedido na mutation.

```js
const [criarContato] = useMutation(ADD_CONTATO, {
    update(cache, { data }) {
      // retorno da mutation
      const newContatoResponse = data?.criarContato;
      // pegar dentro do cache os dados da query GET_CONTATOS
      const existingContatos = cache.readQuery({ query: GET_CONTATOS });

      cache.writeQuery({
        // reescreve dentro do cache da mesma forma que foi escrita, adicionando um novo elemento
        query: GET_CONTATOS,
        data: {
          contatos: [...existingContatos.contatos, newContatoResponse],
        },
      });
    },
  });
```

Dentro do componente à ser usado fazemos sua instância e na função de submit fazemos da seguinte forma:

- chamamos a função correspondente que tem uma propriedade chamada 'variables' que são às variaveis correspondentes da mutation.
- refetch: função que permite chamar novamente a query de consulta caso haja alguma alteração.
- Também temos uma propriedade chamada refetchQueries, ela é chamada assim que a mutation tem sucesso, passamos como parâmetros uma query com a consulta a ser realizada após o sucesso da mutation.

```js
const { contatos } = useContatosContext();

function handleSubmit(event) {
    event.preventDefault();

    contatos.criarContato({
      variables: inputs,
      refetchQueries: [{
        query: GET_CONTATOS,
      }],
    });

    console.log(inputs);
    setInputs(valorInicial);
  }
```