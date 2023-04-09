import { useState } from 'react';
import { ActionIcon, Button, Paper, Image, Flex, Title, Text, NumberInput } from '@mantine/core';
import { IconPlus, IconMinus, IconShoppingCart } from '@tabler/icons';

import SelectVariants from './SelectVariants';

interface Variants {
  name: string;
  values: string[];
}
interface ProductCard {
  src?: string;
  name: string;
  price: string;
  description: string;
  variants?: Variants[];
  productVariants: any[];
  type: string;
  onAddToCart: (product: any, qty: number) => void;
}

export default function ProductsCard(props: ProductCard) {
  const { src, name, price, description, variants, type, productVariants, onAddToCart } = props;
  const [quantity, setQuantity] = useState<number>(1);

  const [selectedPV, setSelectedPV] = useState(
    productVariants?.filter((pv) => pv.is_primary)?.[0] || {}
  );
  const [coord, setCoord] = useState<number[]>(selectedPV.coord);

  const handleSelectVariant = (value: string, values: string[], index: number) => {
    const indexOfVariant = values.indexOf(value);

    setCoord(() => {
      const result = [...coord];
      result[index] = indexOfVariant;

      const pv = productVariants.find((pv) => {
        const coord0 = pv.coord[0] === result[0];
        const coord1 = pv.coord[1] === result[1];

        return coord0 && (variants?.length === 2 ? coord1 : true);
      });

      if (pv) {
        setSelectedPV(pv);
      }

      return result;
    });
  };

  const handleAddToCart = () => {
    if ((!!selectedPV || type === 'NOVARIANT') && quantity > 0) {
      const selected = type === 'NOVARIANT' ? productVariants?.[0] : selectedPV;

      const pure = JSON.parse(JSON.stringify(selected), (key, value) => {
        return key === '__typename' ? undefined : value;
      });
      onAddToCart({ ...pure, name, src, variants, type }, quantity);
      setQuantity(1);
    }
  };

  return (
    <Paper shadow="xl" radius="lg" p="xl" w="100%">
      <Image radius="md" height={160} width="100%" mb="md" src={src} withPlaceholder />
      <Title order={4}>{name}</Title>
      <Text color="dimmed" mb="sm" size="sm">
        {price}
      </Text>

      <Text fz="sm" mb="sm">
        {description}
      </Text>

      {variants?.map((variant, i) => {
        const variantIndex = selectedPV?.coord?.[i];
        return (
          <SelectVariants
            key={i}
            value={variant.values?.[variantIndex]}
            title={variant.name}
            variants={variant.values}
            onChange={(value: string) => handleSelectVariant(value, variant.values, i)}
          />
        );
      })}

      <Title order={6} mb="xs">
        Jumlah
      </Title>
      <Flex align="center" gap="xs" mb="xl">
        <ActionIcon
          disabled={quantity <= 1}
          onClick={() => setQuantity((prev) => prev - 1)}
          radius="lg"
          variant="default"
        >
          <IconMinus size={12} />
        </ActionIcon>
        <NumberInput
          value={quantity}
          radius="xl"
          ta="right"
          min={0}
          onChange={(number: number) => setQuantity(number)}
          styles={{ input: { textAlign: 'center' } }}
          defaultValue={0}
          hideControls
        />
        <ActionIcon onClick={() => setQuantity((prev) => prev + 1)} variant="default" radius="lg">
          <IconPlus size={12} />
        </ActionIcon>
      </Flex>
      <Button
        onClick={handleAddToCart}
        w="100%"
        radius="lg"
        leftIcon={<IconShoppingCart size={18} />}
      >
        Tambah ke Keranjang
      </Button>
    </Paper>
  );
}
