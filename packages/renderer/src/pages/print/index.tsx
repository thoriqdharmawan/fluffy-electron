import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box, Button, Table, TextInput } from '@mantine/core'
import dayjs from 'dayjs'
import { convertToRupiah, print, printTest } from "#preload";

import client from '/@/apollo-client';
import { GLOBAL_FORMAT_DATE } from '/@/context/global';
import { GET_TRANSACTIONS_BY_ID } from '/@/graphql/query'

export default function PrintPage() {
  const [transactionId, setTransactionId] = useState('')

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
      date: dayjs(created_at).format(GLOBAL_FORMAT_DATE),
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
    <>
      <Box ta="center" w="100%" p="xl">
        <Button onClick={() => printTest()}>Test Printer</Button>

        <h4>Masukan ID Transaksi Untuk Mencari</h4>
        <TextInput w={400} mx="auto" value={transactionId} placeholder='Masukan ID Transaksi' onChange={(e) => setTransactionId(e.target.value)} />


        <Box mt="xl" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {loadingPrint && <h3>Loading Detail Transaksi...</h3>}
          {!loadingPrint && dataPrint?.transactions?.map((tr: any, idx: number) => {
            const { products_solds } = tr
            return (
              <div key={idx}>
                <p>product terjual</p>
                <Table withBorder withColumnBorders>
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Total (qty)</th>
                      <th>Harga Satuan</th>
                      <th>Harga Total</th>
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
                </Table>
              </div>
            )
          })}
        </Box>

        {dataPrint?.total.aggregate.count > 0 && (
          <Button style={{ marginTop: 24 }} onClick={handlePrint}>CETAK STRUK</Button>
        )}
      </Box>
    </>
  )
}
