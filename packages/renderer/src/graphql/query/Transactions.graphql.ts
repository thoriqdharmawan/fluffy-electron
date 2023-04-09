import { gql } from "@apollo/client";

export const GET_LIST_TRANSACTIONS = gql`
  query GetListTransactions($where: transactions_bool_exp!, $limit: Int, $offset: Int) {
    total: transactions_aggregate(where: $where) {
      aggregate {
        count
      }
    }

    transactions(where: $where, limit: $limit, offset: $offset, order_by: { created_at: desc }) {
      id
      code
      total_amount
      status
      created_at
    }
  }
`;

export const GET_DETAIL_TRANSACTION = gql`
  query GetListTransactions($id: uuid!) {
    transactions(where: { id: { _eq: $id } }) {
      id
      code
      created_at
      total_amount
      payment_amount
      payment_method
      payment_type
      status
      tax
      tax_type
      products_solds {
        id
        name
        quantity_sold
        total_price
        unit_price
        variants
      }
      employee {
        id
        name
      }
      customer {
        id
        name
      }
    }
  }
`;