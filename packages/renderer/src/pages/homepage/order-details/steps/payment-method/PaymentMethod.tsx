import { Box, SimpleGrid, Paper, Text, TextInput, Select, NumberInput } from '@mantine/core';
import { IconBrandShopee, IconCashBanknote } from '@tabler/icons';
import { UseFormReturnType } from '@mantine/form';

import { FormValues } from '../../DetailModal';
import { convertToRupiah } from '/@/context/helpers';
import CheckboxCard from '/@/components/checkbox/CheckboxCard';
interface Props {
  totalPayment: number;
  form: UseFormReturnType<FormValues>;
  error: boolean;
}

export default function PaymentMethod(props: Props) {
  const { totalPayment, form, error } = props;

  const PAYMENTS = [
    {
      label: 'Online Payment',
      type: 'ONLINE',
      options: [
        {
          icon: IconCashBanknote,
          fieldName: 'GOPAY',
          title: 'Go-Pay',
          disabled: true,
        },
        {
          icon: IconBrandShopee,
          fieldName: 'SHOPEEPAY',
          title: 'ShoppePay',
          disabled: true,
        },
      ],
    },
    {
      label: 'Offline Payment',
      type: 'OFFLINE',
      options: [
        {
          icon: IconCashBanknote,
          fieldName: 'CASHIER',
          title: 'Bayar di Kasir',
          disabled: false,
        },
      ],
    },
  ];

  const handleChangePayment = (fieldName: string, type: string) => {
    form.setValues((prev) => ({ ...prev, paymentMethod: fieldName, paymentType: type }));
  };

  const isErrorPaymentMethod = error && !form.values.paymentMethod;

  return (
    <Box p="md">
      <SimpleGrid
        breakpoints={[
          { minWidth: 'xs', cols: 1 },
          { minWidth: 'sm', cols: 2 },
        ]}
        spacing="xl"
      >
        <div>
          <Text mb="sm" ta="center" size="md" fw="bold">
            Detail Pelanggan
          </Text>
          <Select
            label="Nama Pelanggan"
            placeholder="Pilih Pelanggan"
            labelProps={{ mb: 8 }}
            mb="sm"
            data={[{value: '0', label: 'Umum'}]}
            {...form.getInputProps('customer.name')}
          />
          <NumberInput
            label="Nomor HP"
            placeholder="Masukan Nomor HP"
            labelProps={{ mb: 8 }}
            mb="sm"
            icon={
              <Text size="sm" color="dimmed">
                +62
              </Text>
            }
            hideControls
            {...form.getInputProps('customer.phone')}
          />
          <TextInput
            label="Alamat"
            placeholder="Masukan Alamat Pelanggan"
            labelProps={{ mb: 8 }}
            mb="sm"
            {...form.getInputProps('customer.address')}
          />
          <TextInput
            label="Catatan"
            placeholder="Tambahkan Catatan Pelanggan"
            labelProps={{ mb: 8 }}
            mb="sm"
            {...form.getInputProps('customer.note')}
          />
        </div>
        <div>
          <Text mb="sm" ta="center" size="md" fw="bold">
            Subtotal
          </Text>
          <Paper mb="xl" p="md" withBorder>
            <Text variant="gradient" ta="center" size="xl" fw="bold">
              {convertToRupiah(totalPayment)}
            </Text>
          </Paper>
          {PAYMENTS.map((payment, i) => {
            return (
              <Box key={i}>
                <Text mb="sm" color="dimmed" size="sm">
                  {payment.label}
                </Text>
                {payment.options.map((option, idx) => {
                  return (
                    <CheckboxCard
                      key={idx}
                      icon={<option.icon />}
                      checked={form.values.paymentMethod}
                      onChange={(fieldName) => handleChangePayment(fieldName, payment.type)}
                      fieldName={option.fieldName}
                      title={option.title}
                      error={isErrorPaymentMethod}
                      disabled={option.disabled}
                    />
                  );
                })}
              </Box>
            );
          })}
          {isErrorPaymentMethod && (
            <Text color="red" size="sm">
              Silahkan Pilih Metode Pembayaran
            </Text>
          )}
        </div>
      </SimpleGrid>
    </Box>
  );
}
