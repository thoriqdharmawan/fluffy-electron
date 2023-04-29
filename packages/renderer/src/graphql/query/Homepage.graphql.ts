import { gql } from '@apollo/client';

export const GET_TOTAL_TRANSACTIONS_TODAY = gql`
  query GetTotalTransactionToday(
    $gte: timestamptz
    $lte: timestamptz
    $companyId: uuid!
  ) {
    total: transactions_aggregate(
      where: {
        created_at: { _gte: $gte, _lte: $lte }
        companyId: { _eq: $companyId }
      }
    ) {
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

export const GET_SCANNED_VARIANT = gql`
  query GetScannedVariant($sku: String = "", $companyId: uuid!) {
    product_variants(
      where: {
        sku: { _eq: $sku }
        product_variants_product: { companyId: { _eq: $companyId } }
      }
      limit: 1
    ) {
      id
      coord
      is_primary
      price
      price_wholesale
      min_wholesale
      sku
      status
      stock
      product_variants_product {
        id
        name
        image
        type
        variants {
          id
          values
          name
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