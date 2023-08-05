import { ApolloServer, gql } from 'apollo-server'

const persons = [
  {
    id: 'cdcd-cddc-cdcc-cdaa',
    name: 'John',
    age: 29,
    country: 'Peru',
    phone: '555-555-5555',
  },
  {
    id: 'sacd-sfsd-dsgs-gsdg',
    name: 'Jane',
    age: 21,
    country: 'USA',
    phone: '555-555-5555',
  },
  {
    id: 'sdsc-sdcs-dscs-dscc',
    name: 'Bob',
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
    age: Int!
    country: String!
    phone: String!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
  }
`
// person(id: ID!): Person!

/* DEFINIR COMO SE VAN A RESOLVER LO QUE SE PIDA */
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    // person: (root, args) => {
    //   const person = persons.find(p => p.id === args.id)
    //   return person
    // },
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
