import { gql } from '@apollo/client';

export const START_WORK = gql`
  mutation InsertAttendances(
    $employeeId: uuid!
    $companyId: uuid!
    $money_in_drawer_start: numeric!
    $note: String
  ) {
    insert_attendances(
      objects: {
        employeeId: $employeeId
        companyId: $companyId
        money_in_drawer_start: $money_in_drawer_start
        note: $note
      }
    ) {
      affected_rows
    }
  }
`;

export const DONE_WORK = gql`
  mutation DoneWork($id: uuid!, $money_in_drawer_end: numeric!, $note_end: String) {
    update_attendances(
      where: { id: { _eq: $id } }
      _set: { money_in_drawer_end: $money_in_drawer_end, updated_at: "now()", note_end: $note_end }
    ) {
      affected_rows
    }
  }
`;

export const ADD_TRANSACTION = gql`
  mutation AddTransactions(
    $customerId: Int
    $companyId: uuid!
    $payment_amount: numeric
    $tax: numeric
    $total_amount: numeric
    $code: String
    $payment_method: String
    $payment_type: String
    $status: String
    $tax_type: String
    $employeeId: uuid
    $products_solds: [products_sold_insert_input!]!
  ) {
    insert_transactions(
      objects: {
        customerId: $customerId
        companyId: $companyId
        payment_amount: $payment_amount
        tax: $tax
        total_amount: $total_amount
        code: $code
        payment_method: $payment_method
        payment_type: $payment_type
        status: $status
        tax_type: $tax_type
        employeeId: $employeeId
        products_solds: { data: $products_solds }
      }
    ) {
      affected_rows
      returning {
        id
      }
    }
  }
`;

export const DECREASE_VARIANT_BY_ID = gql`
  mutation DecreaseVarinats($quantity: Int!, $id: Int!) {
    update_product_variants(_inc: { stock: $quantity }, where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;
