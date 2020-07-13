import gql from 'graphql-tag';

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
