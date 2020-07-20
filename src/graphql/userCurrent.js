import { gql } from '@apollo/client';
import USER_CURRENT_FIELDS from './userCurrentFields';

export default gql`
  query userCurrent {
    me(with: {}) {
      ...userCurrentFields
    }
    profile(with: {})
  }
  ${USER_CURRENT_FIELDS}
`;
