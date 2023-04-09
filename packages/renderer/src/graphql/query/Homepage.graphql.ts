import { gql } from '@apollo/client';

export const GET_TOTAL_TRANSACTIONS_TODAY = gql`
  query GetTotalTransactionToday($gte: timestamptz, $lte: timestamptz) {
    total: transactions_aggregate(where: { created_at: { _gte: $gte, _lte: $lte } }) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_ACTIVE_ATTENDACE = gql`
  query GetActiveAttendances($companyId: uuid!) {
    total: attendances_aggregate(
      where: { companyId: { _eq: $companyId }, updated_at: { _is_null: true } }
    ) {
      aggregate {
        count
      }
    }
    attendances(where: { companyId: { _eq: $companyId }, updated_at: { _is_null: true } }) {
      id
      employee {
        id
        name
      }
    }
  }
`;

export const GET_LIST_PRODUCTS_MENUS = gql`
  query GetListProductMenus(
    $where: products_bool_exp!
    $limit: Int
    $offset: Int
  ) {
    total: products_aggregate(
      where: $where
    ) {
      aggregate {
        count
      }
    }
    products(
      where: $where
      limit: $limit
      offset: $offset
      order_by: {name: asc}
    ) {
      id
      name
      image
      product_variants_aggregate {
        aggregate {
          max {
            price
          }
          min {
            price
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($product_id: uuid!) {
    products(where: { id: { _eq: $product_id } }) {
      id
      name
      image
      description
      type
      categories {
        id
        name
      }
      product_variants {
        id
        coord
        is_primary
        price
        price_wholesale
        min_wholesale
        sku
        status
        stock
        productId
      }
      variants {
        id
        values
        name
      }
      product_variants_aggregate {
        aggregate {
          max {
            price
          }
          min {
            price
          }
        }
      }
    }
  }
`;

export const GET_LIST_CUSTOMERS = gql`
  query GetCustomers {
    total: customers_aggregate {
      aggregate {
        count
      }
    }

    customers {
      id
      name
      note
      phone
      address
    }
  }
`;