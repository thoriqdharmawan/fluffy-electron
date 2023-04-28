import { gql } from "@apollo/client";

export const SET_TRANSFER_STOCK = gql`
  mutation TransferStock($id_from: Int!, $id_to:Int!, $stock_from: Int!, $stock_to: Int!) {
    q1: update_product_variants(where: {id: {_eq: $id_from}}, _inc: {stock: $stock_from}) {
      affected_rows
    }
    
    q2: update_product_variants(where: {id: {_eq: $id_to}}, _inc: {stock: $stock_to}) {
      affected_rows
    }
  }
`;
