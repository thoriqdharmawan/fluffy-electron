import { useState } from 'react';
import { Box } from '@mantine/core';

import ListTransactions from './list/ListTransactions';

import HeaderSection from '/@/components/header/HeaderSection';
import DetailTransaction from './detail/DetailTransaction';

export default function Transactions() {
  const [modal, setModal] = useState({
    open: false,
    id: '',
  });

  return (
    <>
      <Box p="lg" w="100%">
        <HeaderSection
          title="Riwayat Transaksi"
          label=" Anda dapat melihat daftar transaksi yang telah dilakukan pada aplikasi kami. Anda dapat melihat detail transaksi seperti tanggal, waktu, jumlah produk, total harga, dan lain-lain. Fitur ini memudahkan Anda untuk memantau transaksi yang telah dilakukan."
        />

        <ListTransactions onClick={(id) => setModal({ open: true, id })} />
      </Box>

      <DetailTransaction
        id={modal.id}
        opened={modal.open}
        onClose={() => setModal({ open: false, id: '' })}
      />
    </>
  );
}
