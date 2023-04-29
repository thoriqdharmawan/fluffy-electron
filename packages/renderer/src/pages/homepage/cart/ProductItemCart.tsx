import { useMemo } from 'react';
import { Box, Flex, Title, Text, Badge, ActionIcon, Paper, Image } from '@mantine/core';
import { IconPlus, IconMinus, IconTrash } from '@tabler/icons';
import { useCart } from 'react-use-cart';

type Props = {
  id: string;
  name: string;
  src: string;
  price: string;
  subtotal: string;
  quantity: number;
  variants: string[];
  onAdd: () => void;
  onSubtract: () => void;
  onRemove: () => void;
};

export default function ProductItemCart({
  id,
  quantity,
  src,
  name,
  price,
  subtotal,
  variants,
  onAdd,
  onSubtract,
  onRemove,
}: Props) {
  const { getItem } = useCart();

  const availableStock =
    useMemo(() => {
      return getItem(id)?.stock;
    }, [id]) || 0;

  return (
    <Paper px="md" py="sm" mb="md" h="auto" shadow="sm" radius="md">
      <Flex justify="start" mb="sm">
        <Image radius="sm" src={src} withPlaceholder width={60} height={60} mr="sm" />
        <Box w="100%">
          <Title order={5} mb="xs">{name}</Title>
          <Flex justify='space-between'>
            <Text color="dimmed" size="sm">
              Harga Satuan
            </Text>
            <Text color="dimmed" size="sm">
              {price}
            </Text>
          </Flex>
          <Flex justify='space-between'>
            <Text color="dimmed" size="sm">
              Harga Total
            </Text>
            <Text color="dimmed" size="sm">
              {subtotal}
            </Text>
          </Flex>
          <Flex mt="sm" gap="sm">
            {variants.map((v, i) => (
              <Badge sx={{ textTransform: 'capitalize' }} key={i}>
                {v}
              </Badge>
            ))}
          </Flex>
        </Box>
      </Flex>
      <Flex align="center" justify="end">
        <ActionIcon onClick={onRemove} radius="lg" variant="light" color="red" mr="sm">
          <IconTrash size={12} />
        </ActionIcon>
        <ActionIcon onClick={onSubtract} radius="lg" variant="light" color="blue">
          <IconMinus size={12} />
        </ActionIcon>

        <Text ta="center" size="sm" w={60} sx={{ userSelect: 'none' }}>
          {quantity}
        </Text>

        <ActionIcon
          onClick={onAdd}
          disabled={quantity >= availableStock}
          radius="lg"
          variant="light"
          color="blue"
        >
          <IconPlus size={12} />
        </ActionIcon>
      </Flex>
    </Paper>
  );
}
