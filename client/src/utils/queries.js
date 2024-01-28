import { gql } from '@apollo/client'

export const GET_ME = gql`
query myAccount {
    me {
        _id
        username
        email
        bookCount
        savedBooks
    }
}
`