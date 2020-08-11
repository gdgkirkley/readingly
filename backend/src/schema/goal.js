import {gql} from 'apollo-server-express'

export default gql`
    extend type Query {
        getGoal(id: ID!): Goal
    }

    extend type Mutation {

    }

    union Goalable = Book | BookShelf

    type Goal {
        id: ID!,
        goalDate: Date!,
        goalable: Goalable!
    }
`
