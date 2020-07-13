import gql from 'graphql-tag';

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
