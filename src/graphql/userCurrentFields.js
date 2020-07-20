import { gql } from '@apollo/client';

export default gql`
  fragment userCurrentFields on user {
    id
    firstName
    lastName
    fullName
    phone
    mobile
    email
    image
    role
    updatedAt
    mock
  }
`;
