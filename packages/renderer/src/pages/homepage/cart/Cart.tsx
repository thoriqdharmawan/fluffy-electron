import { useState, useEffect } from 'react';
import { Paper, Title, Box, ScrollArea, Button, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCart } from 'react-use-cart';
import { IconPlus } from '@tabler/icons';

import { convertToRupiah, getVariants } from '/@/context/helpers';
import { Empty } from '/@/components/empty-state';
import AddManualProduct from './AddManualProduct';
import ProductItemCart from './ProductItemCart';

interface Props {
  onNextToPayment: (allItems: any) => void;
  transacitonNumber: string;
}

export default function Cart(props: Props) {
  const { onNextToPayment, transacitonNumber } = props;
  const { items, updateItemQuantity, removeItem, emptyCart } = useCart();
  const [allItems, setallItems] = useState<any[]>([{}]);
  const [opened, { open, close }] = useDisclosure(false)

  useEffect(() => {
    setallItems(JSON.parse(JSON.stringify(items)));
  }, [items]);

  return (
    <Paper h="100vh" pos="sticky" top={0} shadow="md" radius={0} w="100%">
      <Box component={ScrollArea} h="calc(100vh - 70px)">
        <Flex
          p="md"
          mb="lg"
          pos="sticky"
          top={0}
          justify="space-between"
          sx={(theme) => ({
            zIndex: 1,
            alignItems: 'end',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : '#fff',
          })}
        >
          <Box>
            <Title order={3}>Pesanan ke {transacitonNumber}</Title>
            <Button onClick={open} leftIcon={<IconPlus size={16} />} compact mt="sm" color="teal" variant='light'>Tambahkan Manual</Button>
          </Box>

          <Button compact variant="subtle" onClick={emptyCart}>
            Kosongkan Keranjang
          </Button>
        </Flex>
        <Box px="md">
          {allItems?.map((item: any, i) => {
            const { variants, coord, min_wholesale, price_wholesale, price, quantity } = item || {};

            const actualPrice = (quantity >= min_wholesale ? price_wholesale || price : price) || 0

            const variant = getVariants(variants, coord);

            return (
              <ProductItemCart
                key={i}
                id={item.id}
                quantity={quantity || 0}
                name={item.name}
                // src={item.src}
                price={convertToRupiah(actualPrice)}
                subtotal={convertToRupiah(actualPrice * quantity)}
                variants={variant}
                onAdd={() => updateItemQuantity(item.id, (quantity || 0) + 1)}
                onSubtract={() => updateItemQuantity(item.id, (quantity || 0) - 1)}
                onRemove={() => removeItem(item.id)}
              />
            );
          })}

          {allItems.length === 0 && (
            <Empty title="Tidak Ada Produk" label="Tambahkan Beberapa Produk ke Keranjang." />
          )}
        </Box>
      </Box>
      <Button
        h="70px"
        w="100%"
        m="auto"
        radius={0}
        disabled={allItems.length === 0}
        onClick={() => onNextToPayment(allItems)}
        sx={{
          '&:active': {
            transform: 'translateY(0px)',
          },
        }}
      >
        Lanjut Ke Detail Pesanan
      </Button>

      <AddManualProduct opened={opened} onClose={close} />
    </Paper>
  );
}
