import { Button, Flex } from '@mantine/core'
import { IconPrinter } from '@tabler/icons'
import { GET_TRANSACTIONS_BY_ID } from '/@/graphql/query'
import client from '/@/apollo-client'
import { GLOBAL_FORMAT_DATE } from '../../context/common'
import dayjs from 'dayjs'
import { print } from "#preload";

export default function PrintIcon({ transactionId }: { transactionId: string }) {

  const handlePrint = (id: string) => {
    const promise = client.query({
      query: GET_TRANSACTIONS_BY_ID,
      variables: { id }
    })

    promise.then((res) => {
      const { created_at, total_amount, payment_amount, products_solds } = res?.data?.transactions?.[0] || {}

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
    })
  }


  return (
    <Flex justify="end">
      <Button onClick={() => handlePrint(transactionId)} leftIcon={<IconPrinter />}>
        Cetak Struk
      </Button>
    </Flex>
  )
}
