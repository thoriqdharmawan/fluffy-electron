import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import { convertToRupiah, print, printTest } from "#preload";

import client from "./apollo-client";

export const GET_LIST_TRANSACTIONS = gql`
  query GetListTransactions($limit: Int, $offset: Int) {
    total: transactions_aggregate {
      aggregate {
        count
      }
    }
    transactions(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
    ) {
      id
      code
      total_amount
    }
  }
`;

export const GET_TRANSACTIONS_BY_ID = gql`
  query GetListTransactions($id: uuid!) {
    total: transactions_aggregate(where: { id: { _eq: $id } }) {
      aggregate {
        count
      }
    }
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
      }
    }
  }
`;

export default function App() {
  const [transactionId, setTransactionId] = useState('')

  const { data, loading } = useQuery(GET_LIST_TRANSACTIONS, {
    client: client,
    variables: {
      limit: 4,
      offset: 0,
    }
  })

  const { data: dataPrint, loading: loadingPrint } = useQuery(GET_TRANSACTIONS_BY_ID, {
    client: client,
    skip: !transactionId,
    variables: {
      limit: 1,
      offset: 0,
      id: transactionId,
    }
  })

  const handlePrint = () => {
    const { created_at, total_amount, payment_amount, products_solds } = dataPrint?.transactions?.[0] || {}

    const data_transaction = {
      merchant_name: "Arion Mart",
      location: "Tritih Wetan, Cilacap",
      date: created_at,
      total_amount: total_amount,
      total_payment: payment_amount,
      products_sales: products_solds?.map((ps: any) => ({
        name: ps.name,
        qty: ps.quantity_sold,
        price: ps.unit_price
      }))
    }

    print(data_transaction)
  }

  return (
    <div style={{ textAlign: "center", display: 'flex', flexDirection: 'column' }}>
      <button onClick={() => printTest()}>Test Printer</button>

      <div style={{ marginTop: 24 }}>
        {loading && <h3>Loading Data Transaksi Terbaru...</h3>}
        {!loading && data?.transactions?.map((tr: any) => {
          const res = `${tr.code} ${convertToRupiah(tr.total_amount)}`
          return (
            <button onClick={() => setTransactionId(tr.id)} key={tr.id}>{res}</button>
          )
        })}
      </div>
      <h4>Masukan ID Transaksi Untuk Mencari</h4>
      <input value={transactionId} placeholder='Masukan ID Transaksi' onChange={(e) => setTransactionId(e.target.value)} />


      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {loadingPrint && <h3>Loading Detail Transaksi...</h3>}
        {!loadingPrint && dataPrint?.transactions?.map((tr: any, idx: number) => {
          const { products_solds } = tr
          return (
            <div key={idx}>
              <p>product terjual</p>
              <table>
                <thead>
                  <tr>
                    <td>Nama</td>
                    <td>Total (qty)</td>
                    <td>Harga Satuan</td>
                    <td>Harga Total</td>
                  </tr>
                </thead>
                <tbody>
                  {products_solds?.map((ps: any, idx: any) => {
                    return (
                      <tr key={idx}>
                        <td>{ps.name}</td>
                        <td>{ps.quantity_sold}</td>
                        <td>{convertToRupiah(ps.unit_price)}</td>
                        <td>{convertToRupiah(ps.total_price)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>

      {dataPrint?.total.aggregate.count > 0 && (
        <button style={{ marginTop: 24 }} onClick={handlePrint}>CETAK STRUK</button>
      )}
    </div>
  )
}
