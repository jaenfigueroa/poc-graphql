import { ApolloServer, gql } from 'apollo-server'

const persons = [
  {
    id: '1',
    name: 'Jaen',
    lastname: 'Figueroa',
    age: 23,
    country: 'Peru',
    phone: '555-555-5555',
  },
  {
    id: '2',
    name: 'Ahinara',
    lastname: 'Victorazzi',
    age: 21,
    country: 'USA',
    phone: '555-555-5555',
  },
  {
    id: '3',
    name: 'Foxed',
    lastname: 'Tailer',
    age: 25,
    country: 'Canada',
    phone: '555-555-5555',
  },
]

/* HACER LAS DEFINICIONES */
const typeDefs = gql`
  type Person {
    id: ID!
    name: String!
    lastname: String!
    age: Int!
    country: String!
    phone: String!

    complete: String!
    nacimiento: Int!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    person(name: String!): Person
  }
`

/* DEFINIR COMO SE VAN A RESOLVER LO QUE SE PIDA */
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    person: (root, args) => {
      const person = persons.find((p) => p.name === args.name)
      return person
    },
  },

  /* agregado para Person */
  Person: {
    complete: (root) => `${root.name} ${root.lastname}`,
    nacimiento: (root) => {
      return new Date().getFullYear() - root.age
    },
  },
}

/* CREAR NUESTRO SERVIDOR */
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

/* CORRER NUESTRO SERVIDOR */
server.listen().then(({ url }) => {
  console.log(`Servidor listo en ${url}`)
})
