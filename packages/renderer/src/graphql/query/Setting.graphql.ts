import { gql } from "@apollo/client";

export const GET_LIST_COMPANIES_BY_USER = gql`
  query GetUsers($uid: String!) {
    companies(limit: 10, where: {userId: {_eq: $uid}}) {
      id
      name
    }
  }
`