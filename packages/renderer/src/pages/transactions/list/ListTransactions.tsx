import { useEffect, useMemo, useState } from 'react';
import { Table, Paper, Pagination, Group, Badge, ActionIcon, Title } from '@mantine/core';
import { IconEye } from '@tabler/icons';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';

import { GET_INCOMES, GET_LIST_TRANSACTIONS } from '/@/graphql/query';
import { convertToRupiah } from '/@/context/helpers';
import { GLOBAL_FORMAT_DATE, TRANSACTION_STATUS, VARIABLES_DATE } from '../../../context/common';

import { Empty } from '/@/components/empty-state';
import { useUser } from '/@/context/user';
import { useGlobal } from '/@/context/global';
import client from '/@/apollo-client';
import Loading from '/@/components/loading/Loading';
import Chips from '/@/components/chips/Chips';
import Incomes from '../incomes/Incomes';

interface TableOrderHistoriesProps {
  onClick: (id: string) => void;
}

const getVariableDate = (variant: string = 'NOW') => {
  return VARIABLES_DATE[variant]
}

const LIMIT = 10;

const ListTransactions = ({ onClick }: TableOrderHistoriesProps) => {
  const { value } = useGlobal()
  const user = useUser();
  const companyId = value?.selectedCompany || user.companyId

  const [filter, setFilter] = useState<string>('NOW')

  const [page, setPage] = useState<number>(1)

  const chips = useMemo(() => [
    {
      label: 'Hari ini',
      value: 'NOW',
      checked: filter === 'NOW',
    },
    {
      label: 'Kemarin',
      value: 'YESTERDAY',
      checked: filter === 'YESTERDAY',
    },
    {
      label: 'Bulan ini',
      value: 'THISMONTH',
      checked: filter === 'THISMONTH',
    },
    {
      label: '30 Hari kebelakang',
      value: 'LAST30DAYS',
      checked: filter === 'LAST30DAYS',
    },
    {
      label: 'Semua',
      value: 'ALL',
      checked: filter === 'ALL',
    },
  ], [filter])

  const date = useMemo(() => getVariableDate(filter), [filter])

  const { data, loading, error } = useQuery(GET_LIST_TRANSACTIONS, {
    client: client,
    skip: !companyId,
    fetchPolicy: 'cache-and-network',
    variables: {
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
      where: {
        companyId: companyId ? { _eq: companyId } : undefined,
        created_at: !!date.startdate && date.enddate ? { _gte: date.startdate, _lt: date.enddate } : undefined
      },
    },
  });

  const { data: dataIncomes, loading: loadingIncomes } = useQuery(GET_INCOMES, {
    client,
    skip: !companyId,
    fetchPolicy: 'network-only',
    variables: {
      ...getVariableDate(filter),
      companyId: companyId
    }
  })



  useEffect(() => setPage(1), [filter])

  if (error) {
    console.error(error);
  }

  const totalPage = Math.ceil((data?.total.aggregate.count || 0) / LIMIT);

  const incomesData = useMemo(() => {
    const { count, sum } = dataIncomes?.transactions_aggregate?.aggregate || {}

    return [
      {
        title: "Pendapatan",
        value: convertToRupiah(sum?.total_amount || 0),
        description: 'Total uang yang didapatkan'
      },
      {
        title: "Total Transaksi",
        value: count || 0,
        description: 'Total transaksi yang telah terjadi'
      },
    ]
  }, [dataIncomes])

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
      <Chips data={chips} onChange={setFilter} />

      <Incomes data={incomesData} loading={loadingIncomes} />

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
          <Pagination ml="auto" page={page} total={totalPage} onChange={setPage} />
        </Group>
      </Paper>
    </>
  );
}

export default ListTransactions