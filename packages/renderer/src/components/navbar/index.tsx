import { Navbar as Nav, Stack, Tooltip, UnstyledButton, createStyles } from '@mantine/core';
import { IconHome2, IconShoppingCart, IconPrinter } from '@tabler/icons';
import { Link, useLocation } from 'react-router-dom';
import { ColorSchemeToggle } from '../color-scheme-toggle';
import { UserLogin } from '../user-login';

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

const data = [
  { icon: IconHome2, label: 'Home Page', href: '/' },
  { icon: IconShoppingCart, label: 'Riwayat Transaksi', href: '/transactions' },
  { icon: IconPrinter, label: 'Cetak Stuk', href: '/print' },
  // { icon: IconList, label: 'Daftar Produk', href: '/products' },
  // { icon: IconCash, label: 'Pendapatan', href: '/incomes' },
];

export default function Navbar() {
  const location = useLocation();
  const { classes, cx } = useStyles();

  const menus = data.map((item, index) => {
    const url = `/${location.pathname.split('/')[1]}`;
    const isActive = url === item.href;

    return (
      <Link to={item.href} key={index}>
        <Tooltip label={item.label} position="right">
          <UnstyledButton
            className={cx(classes.link, { [classes.active]: isActive })}
          >
            <item.icon stroke={1.5} />
          </UnstyledButton>
        </Tooltip>
      </Link>
    );
  });

  return (
    <Nav width={{ base: 80 }} p="md">
      <Nav.Section grow>
        <Stack justify="center" spacing={0}>
          {menus}
        </Stack>
      </Nav.Section>
      <Nav.Section sx={{display: 'flex', gap: 12, flexDirection: 'column'}}>
        <ColorSchemeToggle />
        <UserLogin />
      </Nav.Section>
    </Nav>
  );
}
