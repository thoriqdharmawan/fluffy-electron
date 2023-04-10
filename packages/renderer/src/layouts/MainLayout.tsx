import { AppShell, useMantineTheme } from '@mantine/core';
import { Outlet } from 'react-router-dom'

import Navbar from '/@/components/navbar';

export default function MainLayout() {
  const theme = useMantineTheme();

  return (
    <AppShell
      styles={{
        root: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          display: 'flex',
        },
      }}
      navbar={<Navbar />}
      padding={0}
    >
      <Outlet />
    </AppShell>
  );
}
