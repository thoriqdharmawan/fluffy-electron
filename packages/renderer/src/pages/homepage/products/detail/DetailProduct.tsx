import { useState, useMemo } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Modal,
  Title,
  Text,
  Image,
  Flex,
  NumberInput,
  Chip,
} from '@mantine/core';
import { IconPlus, IconMinus, IconShoppingCart } from '@tabler/icons';
import { useCart } from 'react-use-cart';
import { useQuery } from '@apollo/client';

import { GET_PRODUCT_BY_ID } from '/@/graphql/query';
import { convertToRupiah, getPrices } from '/@/context/helpers';
import client from '/@/apollo-client';

import Loading from '/@/components/loading/Loading';

interface Props {
  id: string;
  open: boolean;
  onClose: () => void;
}

const Section = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <Box mb="xl">
      <Title order={6}>{label}</Title>
      <Text fz="sm" mb="sm">
        {value}
      </Text>
    </Box>
  );
};

const LoadingDetail = () => {
  return (
    <>
      <Center>
        <Loading count={1} width={300} height={300} />
      </Center>
      <Box mt="xl">
        <Loading count={3} />
      </Box>
    </>
  );
};


export default function DetailProduct(props: Props) {
  const { addItem, getItem } = useCart();
  const { id, open, onClose } = props;

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPV, setSelectedPV] = useState<any>(undefined);

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    fetchPolicy: 'cache-and-network',
    client: client,
    skip: !id,
    variables: {
      product_id: id,
    },
    onCompleted: (data) => {
      const { product_variants } = data?.products?.[0] || {};

      const selected = product_variants?.filter((pv: any) => pv.is_primary)?.[0] || {};
      setSelectedPV(selected);
    },
  });

  if (error) {
    console.error(error);
  }

  const { name, image, product_variants, product_variants_aggregate, variants, description, type } =
    data?.products?.[0] || {};

  const handleClose = () => {
    onClose();
    setQuantity(1);
  };

  const availableStock =
    useMemo(() => {
      if (selectedPV) {
        const availStock = selectedPV?.stock || 0;
        const quantityInChart = getItem(selectedPV.id)?.quantity || 0;

        return availStock - quantityInChart || 0;
      }
    }, [selectedPV, open]) || 0;

  const handleAddToCart = () => {
    if ((!!selectedPV || type === 'NOVARIANT') && quantity > 0) {
      const selected = type === 'NOVARIANT' ? product_variants?.[0] : selectedPV;

      const pure = JSON.parse(JSON.stringify(selected), (key, value) => {
        return key === '__typename' ? undefined : value;
      });

      addItem({ ...pure, variantName: pure.name, productId: id, name, src: image, variants, type }, quantity);

      handleClose();
    }
  };

  const handleSelectVariant = (variantId: any) => {
    const selected = product_variants.filter((variant: any) => variant.id === Number(variantId))
    setSelectedPV(selected?.[0] || {});
  };

  const rangePrice = useMemo(() => {
    const { max, min } = product_variants_aggregate?.aggregate || {};
    return getPrices(max?.price, min?.price);
  }, [product_variants_aggregate]);

  const actualPrice = useMemo(() => {
    const { min_wholesale, price_wholesale, price } = selectedPV || {};
    return quantity >= min_wholesale ? price_wholesale || price : price;
  }, [selectedPV, quantity]);

  return (
    <Modal size={440} opened={open} onClose={handleClose}>
      {loading && <LoadingDetail />}
      {!loading && (
        <>
          <Image
            height={300}
            width={300}
            mx="auto"
            mb="xl"
            alt={name}
            src={image}
            withPlaceholder
            radius="md"
            placeholder={<Text sx={{ userSelect: 'none' }}>{name}</Text>}
            sx={{ userSelect: 'none' }}
          />

          <Title mb="xs" order={3} ta="center">
            {name}
          </Title>
          <Text color="dimmed" mb="xl" size="sm" ta="center">
            {rangePrice}
          </Text>

          <Section label="Deskripsi Produk" value={description || '-'} />

          <Box mb="md">
            <Title order={6} mb="xs">
              Varian
            </Title>
            <Chip.Group value={selectedPV?.id} onChange={handleSelectVariant} position="left">
              {product_variants?.map((variant: any, idx: number) => (
                <Chip checked={selectedPV?.id === variant?.id} key={idx} value={variant.id}>
                  {variant?.name}
                </Chip>
              ))}
            </Chip.Group>
          </Box>

          <Section label="Stok" value={availableStock || 0} />

          <Title order={6} mb="xs">
            Jumlah
          </Title>
          <Flex align="center" gap="xs" mb="xl" w="100%">
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
              w="100%"
              ta="right"
              min={0}
              max={availableStock}
              onChange={(number: number) => setQuantity(number)}
              styles={{ input: { textAlign: 'center' } }}
              defaultValue={0}
              hideControls
            />
            <ActionIcon
              onClick={() => setQuantity((prev) => prev + 1)}
              variant="default"
              radius="lg"
              disabled={quantity >= availableStock}
            >
              <IconPlus size={12} />
            </ActionIcon>
          </Flex>
          <Text ta="center" fs="italic" color="dimmed" size="sm">
            Harga satu produk: {convertToRupiah(actualPrice || 0)}
          </Text>
        </>
      )}

      <Button
        onClick={handleAddToCart}
        w="100%"
        radius="lg"
        mt="sm"
        disabled={loading || availableStock <= 0}
        leftIcon={<IconShoppingCart size={18} />}
      >
        Tambah ke Keranjang
      </Button>
    </Modal>
  );
}
