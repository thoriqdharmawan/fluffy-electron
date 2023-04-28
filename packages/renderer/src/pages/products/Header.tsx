import { Box, Flex, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

const Header = () => {
  const theme = useMantineTheme();
  const matches = useMediaQuery(`(min-width: ${theme.breakpoints.md}px)`);

  return (
    <>
      <Flex
        gap="md"
        justify="flex-start"
        align="center"
        direction="row"
        wrap="nowrap"
        px="24px"
        py={12}
        top={matches ? 70 : 0}
        sx={(theme) => ({
          zIndex: 4,
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : '#fff',
          borderBottom:
            theme.colorScheme === 'dark'
              ? `2px solid ${theme.colors.dark[6]}`
              : '2px solid #E5E7E9',
          borderTopRightRadius: theme.fontSizes.md,
          borderTopLeftRadius: theme.fontSizes.md,
        })}
      >
        <Box fw={600} w="35%">
          Info Produk
        </Box>
        <Box fw={600} w="18%">
          Harga
        </Box>
        <Box fw={600} w="17%">
          Harga Grosir
        </Box>
        <Box fw={600} w="15%">
          Stok
        </Box>
        <Box fw={600} w="9%">
          Aksi
        </Box>
      </Flex>
    </>
  );
};

export default Header;
