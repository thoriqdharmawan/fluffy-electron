import { useEffect, useState } from "react";
import { Badge, Box, Group, Pagination, Paper, Tabs } from "@mantine/core";
import { useQuery } from "@apollo/client";
import { useDebouncedValue } from "@mantine/hooks";

import { GET_LIST_PRODUCTS } from "/@/graphql/query";
import { Empty } from "/@/components/empty-state";
import { useUser } from "/@/context/user";
import { useGlobal } from "/@/context/global";
import { PRODUCT_STATUS } from "/@/constant/global";
import HeaderSection from "/@/components/header/HeaderSection";
import Loading from "/@/components/loading/Loading";
import SearchBar from "/@/components/SearchBar";
import client from "/@/apollo-client";

import ProductItem from './list/ProductItem'
import Header from "./Header";

const LIMIT = 5;

const EMPTY_PRODUCT = {
  title: 'Tidak Ada Produk',
  label: 'Belum ada produk yang ditambahkan ke dalam sistem',
};

const EMPTY_SEARCH = {
  title: 'Produk Tidak Ditemukan',
  label:
    'Maaf, produk yang Anda cari tidak ditemukan. Silakan periksa kembali kata kunci pencarian Anda atau cobalah kata kunci lain.',
};

type TotalDatas = {
  active: number;
  opname: number;
  waiting: number;
};

export default function index() {
  const { value } = useGlobal()
  const user = useUser();

  const companyId = value?.selectedCompany || user.companyId

  const [productType, setProductType] = useState<string>(PRODUCT_STATUS.ACTIVE);
  const [page, setPage] = useState<number>(1)
  const [search, setSearch] = useState<string>('')
  const [debounce] = useDebouncedValue(search, 1000);
  const [totalDatas, setTotalDatas] = useState<TotalDatas>({
    active: 0,
    opname: 0,
    waiting: 0,
  });
  
  const { data, loading, error } = useQuery(GET_LIST_PRODUCTS, {
    client: client,
    skip: !companyId,
    fetchPolicy: 'cache-and-network',
    variables: {
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
      companyId: companyId,
      where: {
        _and: {
          status: { _eq: productType },
          company: { id: { _eq: companyId } },
          _or: debounce ? [
            { product_variants: { sku: { _eq: debounce } } },
            { name: { _ilike: `%${debounce}%` } },
          ] : undefined,
        }
      },
    },
    onCompleted: ({ total_active, total_opname, total_waiting }) => {
      setTotalDatas((prev) => ({
        ...prev,
        active: total_active.aggregate.count,
        opname: total_opname.aggregate.count,
        waiting: total_waiting.aggregate.count,
      }));
    },
  })

  if (error) {
    console.error(error)
  }

  useEffect(() => setPage(1), [search, productType]);

  const loadingData = !companyId || loading;
  const totalPage = Math.ceil((data?.total.aggregate.count || 0) / LIMIT);

  return (
    <Box p="lg" w="100%">
      <HeaderSection
        title="Daftar Produk"
        label="Anda dapat melihat daftar produk yang telah Anda tambahkan ke dalam aplikasi kami. Anda dapat mengedit atau menghapus produk yang ada sesuai kebutuhan."
      />

      <SearchBar onChange={(e) => setSearch(e.target.value)} placeholder="Cari Produk" mb="24px" />

      <Tabs
        value={productType}
        onTabChange={(v) => setProductType(v || PRODUCT_STATUS.ACTIVE)}
        mb="lg"
      >
        <Tabs.List>
          <Tabs.Tab value={PRODUCT_STATUS.ACTIVE}>
            Aktif <Badge>{totalDatas.active}</Badge>
          </Tabs.Tab>
          <Tabs.Tab value={PRODUCT_STATUS.OPNAME}>
            Opname <Badge>{totalDatas.opname}</Badge>
          </Tabs.Tab>
          <Tabs.Tab value={PRODUCT_STATUS.WAITING_FOR_APPROVAL}>
            Menunggu <Badge>{totalDatas.waiting}</Badge>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Paper shadow="md" radius="md" p="md" mx="auto" mt="xl">
        <Header />

        <Box pos="relative" mih={120}>

          {loadingData && <Loading height={120} />}
          {!loadingData && data?.total.aggregate.count === 0 && (
            <Empty
              title={debounce ? EMPTY_SEARCH.title : EMPTY_PRODUCT.title}
              label={debounce ? EMPTY_SEARCH.label : EMPTY_PRODUCT.label}
            />
          )}

          {!loading && data?.products.map((product: any) => {
            return (
              <ProductItem
                key={product.id}
                id={product.id}
                name={product.name}
                image={product.image}
                product_variants={product.product_variants}
                stock={product.product_variants_aggregate.aggregate.sum.stock}
                type={product.type}
              />
            );
          })}
        </Box>

        <Group mt={24} mb={12}>
          <Pagination m="auto" page={page} total={totalPage} onChange={setPage} />
        </Group>
      </Paper>
    </Box>
  )
}