import { gql } from '@apollo/client';

export default gql`
  mutation userTrack($params: UserTrackInput!) {
    user {
      track(with: $params) {
        code
        message
      }
    }
  }
`;
