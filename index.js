import { gql, ApolloServer, UserInputError } from 'apollo-server'
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
    country: 'Canada',
    city: 'Toronto',
  },
]

/* HACER LAS DEFINICIONES */
const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    country: String!
    city: String!
  }

  type Person {
    id: ID!
    name: String!
    lastname: String!
    age: Int!
    phone: String

    complete: String!
    birth: Int!

    address: Address!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
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
    updatePhone(name: String!, phone: String!): Person
  }
`

/* DEFINIR COMO SE VAN A RESOLVER LO QUE SE PIDA */
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) return persons

      const byPhone = (person) =>
        args.phone === 'YES' ? person.phone : !person.phone

      return persons.filter(byPhone)
    },
    person: (root, args) => {
      const person = persons.find((p) => p.name === args.name)
      return person
    },
  },

  /* MUTACIONES - cambiar datos */
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError('Esta persona ya existe', {
          invalidArgs: args.name,
        })
      }

      const person = { ...args, id: uuid() }
      persons.push(person)
      return person
    },
    updatePhone: (root, args) => {
      const personIndex = persons.findIndex((p) => p.name === args.name)
      if (personIndex === -1) return null

      const person = persons[personIndex]

      const updatedPerson = { ...person, phone: args.phone }
      persons[personIndex] = updatedPerson

      return updatedPerson
    },
  },

  Person: {
    /* agregar cosas que no tiene Person */
    complete: (root) => `${root.name} ${root.lastname}`,
    birth: (root) => {
      return new Date().getFullYear() - root.age
    },
    /* darle una forma usando lo tenemos en la db */
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
