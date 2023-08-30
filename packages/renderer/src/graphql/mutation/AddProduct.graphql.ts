import { gql } from "@apollo/client";

export const UPDATE_IMAGE_PRODUCT = gql`
  mutation InsertProduct($id: uuid!, $image: String!) {
    update_products(where: { id: { _eq: $id } }, _set: { image: $image }) {
      affected_rows
    }
  }
`;
