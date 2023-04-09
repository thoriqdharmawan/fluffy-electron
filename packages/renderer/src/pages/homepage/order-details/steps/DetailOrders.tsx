import { Badge, Box, Flex, Text, Image, Table } from '@mantine/core';

import { convertToRupiah, getVariants } from '/@/context/helpers';

interface Props {
  open: boolean;
  products: any[];
  totalPayment: number;
}

export default function DetailOrders(props: Props) {
  const { products, totalPayment } = props;

  const rows = products?.map((product) => {
    const variants = getVariants(product.variants, product.coord);
    const isVariant = product.type === 'VARIANT';

    const isWholesale = product.quantity >= product.min_wholesale;
    const actualPrice = isWholesale ? product.price_wholesale : product.price;

    return (
      <tr key={product.id}>
        <td>
          <Image width={60} height={60} radius="sm" withPlaceholder src={product.src} />
        </td>
        <td>{product.name}</td>
        <td>
          <Flex gap="sm">
            {isVariant ? (
              variants?.map((variant, i) => (
                <Badge key={i} sx={{ textTransform: 'capitalize' }}>
                  {variant}
                </Badge>
              ))
            ) : (
              <Text fs="italic" color="dimmed">
                Tidak ada varian
              </Text>
            )}
          </Flex>
        </td>
        <td>
          <Text ta="center">{product.quantity}</Text>
        </td>
        <td>
          <Text miw={90} ta="right">{convertToRupiah(actualPrice)}</Text>
        </td>
        <td>
          <Text miw={90} ta="right">
            {convertToRupiah(isWholesale ? actualPrice * product.quantity : product.itemTotal)}
          </Text>
        </td>
      </tr>
    )
  });

  return (
    <Box p="md">
      <Text color="dimmed" mb="xl" maw="70%">
        Periksa kembali barang-barang yang telah dimasukkan ke dalam keranjang belanja sebelum
        melanjutkan proses pembayaran.
      </Text>

      <Table hidden={!open} horizontalSpacing="xl" highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Foto Produk</th>
            <th>Nama Produk</th>
            <th>Varian Produk</th>
            <th>Total (Qty)</th>
            <th>Harga Satuan</th>
            <th>Harga Total</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr>
            <td colSpan={4}>
              <Text py="md" ta="right" fw={700}>
                Subtotal
              </Text>
            </td>
            <td colSpan={2}>
              <Text fw={700} ta="right">
                {convertToRupiah(totalPayment)}
              </Text>
            </td>
          </tr>
        </tbody>
      </Table>
    </Box>
  );
}
