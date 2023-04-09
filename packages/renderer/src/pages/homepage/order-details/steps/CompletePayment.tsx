import { Center, Table, Text, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

import { FormValues } from '../DetailModal';
import { convertToRupiah } from '/@/context/helpers';
import TransactionId from '/@/components/cards/TransactionId';

interface Props {
  form: UseFormReturnType<FormValues>;
  totalPayment: number;
  transactionId: string;
}

export default function CompletePayment(props: Props) {
  const { form, totalPayment, transactionId } = props;

  const offset = (form.values.paymentAmount || 0) - totalPayment;

  return (
    <Center mih={420} sx={{ display: 'flex', flexDirection: 'column' }} mt="2rem">
      <Title my="xl" order={4}>
        Pembayaran Berhasil 🥳🥳
      </Title>
      <Table
        maw={400}
        horizontalSpacing="xl"
        withBorder
        highlightOnHover
        striped
        verticalSpacing="md"
        mb="2rem"
      >
        <tbody>
          <tr>
            <td>Total Tagihan</td>
            <td>
              <Text ta="right">{convertToRupiah(totalPayment)}</Text>
            </td>
          </tr>
          <tr>
            <td>Dibayar</td>
            <td>
              <Text ta="right">{convertToRupiah(form.values.paymentAmount)}</Text>
            </td>
          </tr>
          {offset > 0 && (
            <tr>
              <td>Kembali</td>
              <td align="right">
                <Text color="green" size="md" fw="bold">
                  + {convertToRupiah(offset)}
                </Text>
              </td>
            </tr>
          )}
          {offset < 0 && (
            <tr>
              <td>Kurang</td>
              <td align="right">
                <Text color="red" size="md" fw="bold">
                  - {convertToRupiah(Math.abs(offset))}
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <TransactionId transactionId={transactionId} />
    </Center>
  );
}
