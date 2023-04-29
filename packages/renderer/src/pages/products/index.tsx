import { useEffect, useState } from "react";
import { Box, Group, Pagination, Paper } from "@mantine/core";
import { useQuery } from "@apollo/client";
import { useDebouncedValue } from "@mantine/hooks";

import { GET_LIST_PRODUCTS } from "/@/graphql/query";
import { Empty } from "/@/components/empty-state";
import { useUser } from "/@/context/user";
import HeaderSection from "/@/components/header/HeaderSection";
import Loading from "/@/components/loading/Loading";
import SearchBar from "/@/components/SearchBar";
import client from "/@/apollo-client";

import ProductItem from './list/ProductItem'
import Header from "./Header";

const LIMIT = 5;

export default function index() {
  const { companyId } = useUser();

  const [page, setPage] = useState<number>(1)
  const [searchRaw, setSearch] = useState<string>('')
  const [search] = useDebouncedValue(searchRaw, 1000);

  const { data, loading, error } = useQuery(GET_LIST_PRODUCTS, {
    client: client,
    skip: !companyId,
    variables: {
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
      where: {
        _and: {
          company: { id: { _eq: companyId } },
          _or: search ? [
            { product_variants: { sku: { _eq: search } } },
            { name: { _ilike: `%${search}%` } },
          ] : undefined,
        }
      },
    }
  })

  if (error) {
    console.error(error)
  }

  useEffect(() => setPage(1), [search])

  const loadingData = !companyId || loading;
  const totalPage = Math.ceil((data?.total.aggregate.count || 0) / LIMIT);

  return (
    <Box p="lg" w="100%">
      <HeaderSection
        title="Daftar Produk"
        label="Anda dapat melihat daftar produk yang telah Anda tambahkan ke dalam aplikasi kami. Anda dapat mengedit atau menghapus produk yang ada sesuai kebutuhan."
      />

      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb="24px"
        placeholder="Cari Produk"
      />

      <Paper shadow="md" radius="md" p="md" mx="auto" mt="xl">
        <Header />

        <Box pos="relative" mih={120}>

          {loadingData && <Loading height={120} />}
          {!loadingData && data?.total.aggregate.count === 0 && (
            <Empty
              title="Tidak Ada Produk"
              label="Belum ada produk yang ditambahkan ke dalam sistem."
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