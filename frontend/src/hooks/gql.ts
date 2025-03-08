import { gql, useQuery } from '@apollo/client';

export const NOTICES_QUERY = gql`
  query notices {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;