import { gql } from "@apollo/client";

export const UPDATE_IMAGE_PRODUCT = gql`
  mutation InsertProduct($id: uuid!, $image: String!) {
    update_products(where: { id: { _eq: $id } }, _set: { image: $image }) {
      affected_rows
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation InsertProduct(
    $name: String
    $image: String
    $companyId: uuid
    $description: String
    $type: String
    $status: String
    $variants: [variants_insert_input!]!
    $product_variants: [product_variants_insert_input!]!
  ) {
    insert_products(
      objects: {
        name: $name
        image: $image
        companyId: $companyId
        description: $description
        type: $type
        status: $status
        variants: { data: $variants }
        product_variants: { data: $product_variants }
      }
    ) {
      affected_rows
      returning {
        id
        status
      }
    }
  }
`;
