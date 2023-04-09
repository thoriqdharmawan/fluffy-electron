import { gql } from '@apollo/client';

export const GET_LIST_USER_LOGIN = gql`
  query GetuserLogin($uid: String!) {
    users(where: { id: { _eq: $uid } }) {
      id
      name
      companyId
    }
  }
`;

export const GET_LIST_EMPLOYEES = gql`
  query GetEmployees($where: employees_bool_exp!) {
    total: employees_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    employees(where: $where, limit: 10, order_by: { created_at: desc }) {
      id
      name
    }
  }
`;
