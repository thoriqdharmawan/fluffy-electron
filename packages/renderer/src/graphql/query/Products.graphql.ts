import { gql } from "@apollo/client";

export const GET_LIST_PRODUCTS = gql`
  query GetListProduct($where: products_bool_exp!, $limit: Int, $offset: Int, $companyId: uuid) {
    total: products_aggregate(where: $where) {
      aggregate {
        count
      }
    }
    total_active: products_aggregate(
      where: { status: { _eq: "ACTIVE" }, company: { id: { _eq: $companyId } } }
    ) {
      aggregate {
        count
      }
    }

    total_opname: products_aggregate(
      where: { status: { _eq: "OPNAME" }, company: { id: { _eq: $companyId } } }
    ) {
      aggregate {
        count
      }
    }

    total_waiting: products_aggregate(
      where: { status: { _eq: "WAITING_FOR_APPROVAL" }, company: { id: { _eq: $companyId } } }
    ) {
      aggregate {
        count
      }
    }
    products(
      where: $where
      limit: $limit
      offset: $offset
      order_by: { name: asc }
    ) {
      id
      name
      image
      type
      product_variants(limit: 1) {
        id
        is_primary
        price
        price_wholesale
        sku
        status
        stock
      }
      product_variants_aggregate {
        aggregate {
          sum {
            stock
          }
        }
      }
    }
  }
`;

export const GET_LIST_PRODUCT_VARIANTS = gql`
  query GetProductVariants($productId: uuid!) {
    product_variants(where: { productId: { _eq: $productId } }, order_by: { id: asc }) {
      id
      name
      is_primary
      price
      price_wholesale
      min_wholesale
      scale
      sku
      status
      stock
      productId
    }
  }
`;

export const EDIT_PRODUCT_STOCK = gql`
  mutation UpdateStock($id: Int!, $stock: Int!) {
    update_product_variants(
      where: { id: { _eq: $id } }
      _set: { stock: $stock }
    ) {
      affected_rows
    }
  }
`;


export const GET_LIST_PRODUCT_VARIANTS_STOCK = gql`
  query GetProductVariants($productId: uuid!) {
    product_variants(where: { productId: { _eq: $productId } }, order_by: { id: asc }) {
      id
      name
      scale
      stock
    }
  }
`;