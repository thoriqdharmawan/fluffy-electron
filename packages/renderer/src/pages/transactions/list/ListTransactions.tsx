import { Table, Paper, Pagination, Group, Badge, ActionIcon, Title } from '@mantine/core';
import { IconEye } from '@tabler/icons';
import { useQuery } from '@apollo/client';
import { usePagination } from '@mantine/hooks';
import dayjs from 'dayjs';

import { GET_LIST_TRANSACTIONS } from '/@/graphql/query';
import { convertToRupiah } from '/@/context/helpers';
import { GLOBAL_FORMAT_DATE, TRANSACTION_STATUS } from '/@/context/global';

import client from '/@/apollo-client';
import Loading from '/@/components/loading/Loading';
import { Empty } from '/@/components/empty-state';
import { useUser } from '/@/context/user';

interface TableOrderHistoriesProps {
  onClick: (id: string) => void;
}

const LIMIT = 10;

const ListTransactions = ({ onClick }: TableOrderHistoriesProps) => {
  const { companyId } = useUser();

  const pagination = usePagination({ total: 10, initialPage: 1 });

  const { data, loading, error } = useQuery(GET_LIST_TRANSACTIONS, {
    client: client,
    skip: !companyId,
    fetchPolicy: 'cache-and-network',
    variables: {
      limit: LIMIT,
      offset: (pagination.active - 1) * LIMIT,
      where: {
        companyId: companyId ? { _eq: companyId } : undefined,
      },
    },
  });

  if (error) {
    console.error(error);
  }

  const totalPage = Math.ceil((data?.total.aggregate.count || 0) / LIMIT);

  const rows = data?.transactions?.map((row: any) => {
    return (
      <tr key={row.id}>
        <td>{row.code || '-'}</td>
        <td>{dayjs(row.created_at).format(GLOBAL_FORMAT_DATE)}</td>
        <td>{convertToRupiah(row.total_amount)}</td>
        <td>
          <Badge color="green">{TRANSACTION_STATUS[row.status] || 'Selesai'}</Badge>
        </td>
        <td>
          <ActionIcon onClick={() => onClick(row.id)} variant="light" color="primary">
            <IconEye size={16} />
          </ActionIcon>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Title order={4} mb="md">
        Total Transaksi: {data?.total.aggregate.count}
      </Title>
      <Paper shadow="sm" p="md" withBorder w="100%">
        <Table verticalSpacing="xs" striped>
          <thead>
            <tr>
              <th>Nomor Transaksi</th>
              <th>Waktu Transaksi</th>
              <th>Total Transaksi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          {!loading && <tbody>{rows}</tbody>}
        </Table>
        {loading && <Loading />}
        {data?.total.aggregate.count === 0 && (
          <Empty
            title="Tidak Ada Transaksi"
            label="Anda belum melakukan transaksi apapun. Riwayat transaksi akan muncul di sini setelah Anda melakukan transaksi pertama Anda."
          />
        )}
        <Group mt={24} mb={12}>
          <Pagination ml="auto" total={totalPage} onChange={pagination.setPage} />
        </Group>
      </Paper>
    </>
  );
}

export default ListTransactions