import { Box, Text, Paper, NumberInput, Table } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

import { convertToRupiah } from '/@/context/helpers';
import { FormValues } from '../DetailModal';
import RecommendationCash from './payment-method/RecommendationCash';

interface Props {
  totalPayment: number;
  form: UseFormReturnType<FormValues>;
  error: boolean;
}

export default function PayNow(props: Props) {
  const { totalPayment, form, error } = props;

  const handleChangeAmount = (nominal: number) => {
    form.setFieldValue('paymentAmount', nominal);
  };

  const isErrorNominal = error && !form.values.paymentAmount;

  const offset = (form.values.paymentAmount || 0) - totalPayment;

  return (
    <Box>
      <Box maw={400} mx="auto">
        <Text mb="sm" ta="center" size="md" mt="lg">
          Total Tagihan
        </Text>
        <Paper mb="xl" p="xl" withBorder>
          <Text variant="gradient" ta="center" size="xl" fw="bold">
            {convertToRupiah(totalPayment)}
          </Text>
        </Paper>

        <Text mb="sm">Masukan Nominal Pembayaran</Text>
        <NumberInput
          ta="center"
          size="xl"
          mb="sm"
          icon="Rp"
          min={0}
          withAsterisk
          hideControls
          placeholder='Masukan Nominal Pembayaran'
          styles={{ input: { textAlign: 'center' } }}
          parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
          formatter={(value: any) =>
            !Number.isNaN(parseFloat(value)) ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
          }
          {...form.getInputProps('paymentAmount')}
          error={isErrorNominal}
        />

        {isErrorNominal && (
          <Text color="red" size="sm" mb="lg">
            Silahkan Masukan Nominal Pembayaran
          </Text>
        )}

        <RecommendationCash onClick={handleChangeAmount} total={totalPayment} />

        <Table>
          <tbody>
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
      </Box>
    </Box>
  );
}
