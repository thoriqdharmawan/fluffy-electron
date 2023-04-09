import { useState } from 'react';
import { Text, Flex, Box, Grid, ScrollArea, ActionIcon, Menu, Button, Center } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery } from '@apollo/client';
import { IconChevronDown, IconCircleCheck } from '@tabler/icons';

import { Empty } from '/@/components/empty-state';
import { GET_LIST_PRODUCTS_MENUS } from '/@/graphql/query';
import { getPrices } from '/@/context/helpers';
import { useUser } from '/@/context/user';

import client from '/@/apollo-client';

import SearchBar from '/@/components/SearchBar';
import ProductCardV2 from '/@/components/cards/ProductCardV2';
import DetailProduct from './detail/DetailProduct';
import Loading from '/@/components/loading/Loading';
import ModalCheckout from './ModalCheckout';

interface Props {
  employeeId: string;
  employeeName: string;
  attendanceId: string;
  onDoneWork: () => void;
}

const LIMIT = 12;

const Loader = () => {
  return (
    <>
      {new Array(LIMIT).fill(0).map((i, idx) => {
        return (
          <Grid.Col key={`${i}${idx}`} sm={6} lg={4} xl={3}>
            <Loading width="100%" height={242} count={1} />
          </Grid.Col>
        );
      })}
    </>
  );
};

const EMPTY_PRODUCT = {
  title: 'Tidak Ada Produk',
  label:
    'Anda belum menambahkan produk apapun ke sistem. Daftar produk yang telah ditambahkan akan muncul di sini',
};

const EMPTY_SEARCH = {
  title: 'Produk Tidak Ditemukan',
  label:
    'Maaf, produk yang Anda cari tidak ditemukan. Silakan periksa kembali kata kunci pencarian Anda atau cobalah kata kunci lain.',
};


const Products = (props: Props) => {
  const { attendanceId, employeeName, onDoneWork } = props;
  const { companyId } = useUser();

  const [openCheckout, setOpenCheckout] = useState<boolean>(false);
  const [search, setSearch] = useState('');
  const [loadingData, setLoadingData] = useState<boolean>(false)
  const [detail, setDetail] = useState({
    open: false,
    id: '',
  });
  const [debounce] = useDebouncedValue(search, 500);

  const { data, loading, fetchMore } = useQuery(GET_LIST_PRODUCTS_MENUS, {
    client: client,
    fetchPolicy: 'cache-and-network',
    skip: !companyId,
    variables: {
      limit: LIMIT,
      offset: 0,
      where: {
        _and: {
          company: { id: { _eq: companyId } },
          _or: debounce ? [
            { description: { _ilike: `%${debounce}%` } },
            { name: { _ilike: `%${debounce}%` } },
          ] : undefined,
        }
      }
    },
  });

  const totalData = data?.products.length
  const total = data?.total.aggregate.count

  const fetchMoreData = () => {
    setLoadingData(true)
    fetchMore({
      variables: {
        offset: totalData,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        setLoadingData(false)
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          products: [...prev.products, ...fetchMoreResult.products].filter(
            (v, i, a) => a.findIndex((t) => t.id === v.id) === i
          ),
        });
      },
    });
  };

  return (
    <>
      <ScrollArea
        id="scrollableDiv"
        sx={{ height: '100vh', width: '100%' }}
        offsetScrollbars
        type="auto"
      >
        <Box
          sx={(theme) => ({
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          })}
        >
          <Flex gap="lg" w="100%" p="lg" pos="sticky" top={0} justify="space-between" align="center" sx={(theme) => ({ zIndex: 1, background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0], })}>
            <Flex justify="space-between" align="center" gap="sm">
              <Menu shadow="md" width={200}>
                <Text sx={{ whiteSpace: 'pre' }} variant="gradient" size="md" fw="bold">
                  Halo, {employeeName}
                </Text>
                <Menu.Target>
                  <ActionIcon size="sm">
                    <IconChevronDown />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<IconCircleCheck size={14} />}
                    onClick={() => setOpenCheckout(true)}
                  >
                    Selesai Bekerja
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
            <SearchBar onChange={(e) => setSearch(e.target.value)} placeholder="Cari Produk" />
          </Flex>
          <Grid px="lg">
            {!loading &&
              data?.products.map((product: any) => {
                const { max, min } = product?.product_variants_aggregate?.aggregate || {};
                const prices = getPrices(max?.price, min?.price);

                return (
                  <Grid.Col key={product.id} sm={6} lg={4} xl={3}>
                    <ProductCardV2
                      key={product.id}
                      src={product.image}
                      name={product.name}
                      price={prices}
                      onClick={() => setDetail({ open: true, id: product.id })}
                    />
                  </Grid.Col>
                );
              })}
            {(loadingData || loading) && <Loader />}
          </Grid>
          {!loadingData && !loading && total === 0 && (
            <Empty
              title={debounce ? EMPTY_SEARCH.title : EMPTY_PRODUCT.title}
              label={debounce ? EMPTY_SEARCH.label : EMPTY_PRODUCT.label}
            />
          )}
        </Box>

        {!loading && !loadingData && (total - totalData > 0) && (
          <Center my={68}>
            <Button
              hidden={totalData >= total}
              onClick={fetchMoreData}
              variant="outline"
            >
              Tampilkan Lebih Banyak Produk
            </Button>
          </Center>
        )}
      </ScrollArea>

      <DetailProduct
        open={detail.open}
        id={detail.id}
        onClose={() => setDetail({ open: false, id: '' })}
      />

      <ModalCheckout
        attendanceId={attendanceId}
        opened={openCheckout}
        name={employeeName}
        onClose={() => setOpenCheckout(false)}
        onDoneWork={onDoneWork}
      />
    </>
  );
}

export default Products