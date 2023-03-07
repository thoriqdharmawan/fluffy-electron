import { gql, useQuery } from '@apollo/client';

import { print } from "#preload";
import client from "./apollo-client";

type Props = {}

export default function App({ }: Props) {

  const { data, loading } = useQuery(GET_LIST_TRANSACTIONS, {
    client: client,
    variables: {
      limit: 5,
      offset: 0
    }
  })

  return (
    <div style={{ textAlign: "center", display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => print("Test")}>print Thoriq</button>
      {!loading && data?.transactions?.map((tr: any) => {
        const res = `${tr.code} ${tr.total_amount}`
        return (
          <button onClick={() => print(res)} key={tr.id}>{res}</button>
        )
      })}
    </div>
  )
}


export const GET_LIST_TRANSACTIONS = gql`
  query GetListTransactions($limit: Int, $offset: Int) {
    total: transactions_aggregate {
      aggregate {
        count
      }
    }
    transactions(limit: $limit, offset: $offset, order_by: { created_at: desc }) {
      id
      code
      total_amount
      status
      created_at
    }
  }
`;