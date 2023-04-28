import { Box, Divider, Flex, Text } from "@mantine/core"

import { convertToRupiah } from "/@/context/helpers";

type Props = {
  id: number;
  name: string;
  sku: string;
  price: number;
  price_wholesale: number;
  min_wholesale: number;
  scale: number | undefined;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  refetch: () => void;
  onChangeStock?: () => void;
};

const Wholesale = ({ price, price_wholesale, min_wholesale }: { price: number, price_wholesale: number, min_wholesale: number }) => {
  if (price_wholesale === price || !price_wholesale) {
    return <Text color="dimmed" fs="italic" size="xs">Tidak ada harga grosir</Text>
  }

  return (
    <Flex direction="column">
      <Text>{convertToRupiah(price_wholesale)}</Text>
      <Text color="dimmed" size="sm">min. pembelian {min_wholesale}</Text>
    </Flex>
  )
}

export default function ListProductVariant(props: Props) {
  const { name, sku, price, price_wholesale, min_wholesale, stock, scale } = props;

  return (
    <>
      <Divider sx={(theme) => ({
        color: theme.colorScheme === 'dark'
          ? `${theme.colors.dark[6]}`
          : '#E5E7E9'
      })} />
      <Flex
        gap="md"
        justify="flex-start"
        align="center"
        direction="row"
        wrap="nowrap"
        px="24px"
        py="md"
      >
        <Box w="30%">
          <Text mb="4px" fw={600}>
            {name}
          </Text>
          <Text color="dimmed" size="xs">
            SKU: {sku || '-'}
          </Text>
          <Text color="dimmed" mb="xs" size="xs">
            Skala Varian: {scale || 1}
          </Text>
        </Box>
        <Box w="20%">{convertToRupiah(price)}</Box>
        <Box w="20%">
          <Wholesale price={price} price_wholesale={price_wholesale} min_wholesale={min_wholesale} />
        </Box>
        <Box w="19%">
          {stock}
        </Box>

        <Box w="5%">
          {/* <Flex gap="sm" align="center">
            <MenuDropdown sections={PRODUCT_ACTION_MENUS}>
              <ActionIcon>
                <IconDots size={18} />
              </ActionIcon>
            </MenuDropdown>
          </Flex> */}
        </Box>
      </Flex>
    </>
  )
}