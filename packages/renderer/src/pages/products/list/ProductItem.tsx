import { ActionIcon, AspectRatio, Box, Divider, Flex, Image, Text, UnstyledButton } from "@mantine/core";
import { IconDots, IconSelector, IconTransform } from "@tabler/icons";

import { GET_LIST_PRODUCT_VARIANTS } from "/@/graphql/query";
import { convertToRupiah } from "/@/context/helpers";
import MenuDropdown from "/@/components/menu/MenuDropdown";
import Loading from "/@/components/loading/Loading";
import client from "/@/apollo-client";

import ListProductVariant from './ListProductVariant'
import { useState } from "react";

import StockEditable from "./StockEditable";
import SwitchStock from "../modal/SwitchStock";

interface Props {
  id: string;
  name: string;
  image: string;
  product_variants: any[];
  stock: number;
  type: 'VARIANT' | 'NOVARIANT';
}


export default function ProductItem(props: Props) {
  const {
    id: productId,
    name,
    image,
    product_variants,
    stock,
    type,
  } = props;
  const [loadingVariants, setLoadingVariants] = useState<boolean>(false)
  const [openVariants, setOpenVariants] = useState<boolean>(false)
  const [dataVariants, setDataVariants] = useState<any>({});
  const [openSwitchStock, setOpenSwitchStock] = useState<boolean>(false)

  const PRODUCT_ACTION_MENUS = [
    {
      label: 'Produk',
      items: [
        {
          icon: <IconTransform size={14} />,
          children: 'Bongkar Pasang Stok',
          onClick: () => setOpenSwitchStock(true),
        }
      ],
    },
  ];

  const fetchData = () => {
    setLoadingVariants(true)
    const promise = client.query({
      query: GET_LIST_PRODUCT_VARIANTS,
      fetchPolicy: 'network-only',
      variables: { productId }
    })

    promise.then((res) => {
      setDataVariants(res.data);
      setLoadingVariants(false)
    })
  }

  const handleOpenVariants = () => {
    if (openVariants) {
      setOpenVariants(false)
    } else {
      setOpenVariants(true)
      fetchData()
    }
  }

  const { sku, id, price, price_wholesale } = product_variants?.[0] || {}

  const VT = <Text color="dimmed" fs="italic" size="xs">Buka varian produk untuk melihat harga</Text>
  const NoWholsale = <Text color="dimmed" fs="italic" size="xs">Tidak ada harga grosir</Text>
  const isVariant = type === 'VARIANT'

  const prices = isVariant ? VT : convertToRupiah(price || 0)
  const prices_wholesale = isVariant ? VT : (price_wholesale ? convertToRupiah(price_wholesale || 0) : NoWholsale)

  return (
    <>
      <Divider />
      <Box>
        <Flex gap="md" justify="flex-start" align="center" direction="row" wrap="nowrap" px="24px">
          <Box w="35%" display="flex" py={12}>
            <AspectRatio ratio={1 / 1} maw={100} w="100%">
              <Image
                withPlaceholder
                src={image}
                radius="md"
                color="blue"
                width="100%"
                height="auto"
              />
            </AspectRatio>
            <Flex justify="center" align="flex-start" direction="column" ml="md">
              <Text size="md" mb={4}>
                {name}
              </Text>
              <Text color="dimmed" mb="xs" size="xs">
                SKU: {sku || '-'}
              </Text>
            </Flex>
          </Box>
          <Box w="18%">{prices}</Box>
          <Box w="17%">{prices_wholesale}</Box>
          <Box w="15%">
            <StockEditable stock={stock} id={id} editable={false} />
          </Box>
          <Box w="9%">
            <Flex gap="sm" align="center">
              <MenuDropdown sections={PRODUCT_ACTION_MENUS}>
                <ActionIcon disabled={false}>
                  <IconDots size={18} />
                </ActionIcon>
              </MenuDropdown>
            </Flex>
          </Box>
        </Flex>


        {isVariant && (
          <Box
            mx={36}
            mb={24}
            sx={(theme) => ({
              borderRadius: 5,
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : '#F3F4F5',
            })}
          >
            <UnstyledButton
              px={16}
              py={8}
              w="100%"
              display="flex"
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
              onClick={handleOpenVariants}
            >
              <Text size="sm" fw={700} color="dimmed">
                Lihat varian produk
              </Text>

              <IconSelector size={16} />
            </UnstyledButton>

            {openVariants && loadingVariants && (<Loading count={2} height={46} />)}
            {openVariants &&
              !loadingVariants &&
              dataVariants?.product_variants?.map((productVariant: any) => {
                return (
                  <ListProductVariant
                    key={productVariant.id}
                    id={productVariant.id}
                    name={productVariant?.name || '-'}
                    sku={productVariant.sku}
                    price={productVariant.price}
                    price_wholesale={productVariant.price_wholesale}
                    min_wholesale={productVariant.min_wholesale}
                    scale={productVariant.scale}
                    stock={productVariant.stock}
                    status={productVariant.status}
                    refetch={fetchData}
                  />
                );
              })}
          </Box>
        )}
      </Box>

      <SwitchStock
        opened={openSwitchStock}
        id={productId}
        onClose={() => setOpenSwitchStock(false)}
        refetch={fetchData}
      />
    </>
  )
}