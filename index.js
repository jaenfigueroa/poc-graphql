import { ApolloServer, gql } from 'apollo-server'
import { v4 as uuid } from 'uuid'

const persons = [
  {
    id: '1',
    name: 'Jaen',
    lastname: 'Figueroa',
    age: 23,
    phone: '555-555-5555',
    country: 'Peru',
    city: 'Arequipa',
  },
  {
    id: '2',
    name: 'Ahinara',
    lastname: 'Victorazzi',
    age: 21,
    phone: '555-555-5555',
    country: 'USA',
    city: 'Miami',
  },
  {
    id: '3',
    name: 'Foxed',
    lastname: 'Tailer',
    age: 25,
    phone: '555-555-5555',
    country: 'Canada',
    city: 'Toronto',
  },
]

/* HACER LAS DEFINICIONES */
const typeDefs = gql`
  type Address {
    country: String!
    city: String!
  }

  type Person {
    id: ID!
    name: String!
    lastname: String!
    age: Int!
    phone: String!

    complete: String!
    nacimiento: Int!

    address: Address!
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    person(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      lastname: String!
      age: Int!
      phone: String!
      country: String!
      city: String!
    ): Person
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

  /* MUTACIONES - cambiar datos */
  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() }
      persons.push(person)
      return person
    },
  },

  Person: {
    /* agregar cosas que no tiene a Person */
    complete: (root) => `${root.name} ${root.lastname}`,
    nacimiento: (root) => {
      return new Date().getFullYear() - root.age
    },
    /* darle una forma con lo que tenemos en la db */
    address: (root) => {
      return {
        country: root.country,
        city: root.city,
      }
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
