import { Paper, Title, Flex, Text, CopyButton, Tooltip, ActionIcon } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons';

interface Props {
  transactionId: string;
}

export default function TransactionId(props: Props) {
  const { transactionId = '' } = props;

  return (
    <Flex justify="center" align="center" direction="column" wrap="wrap">
      <Title order={5}>ID Transaksi</Title>
      <Paper miw={400} mt="md" mb="md" p="lg" shadow="sm" radius="md" withBorder>
        <Flex gap="md" justify="center" align="center" direction="row" wrap="wrap">
          <Text variant="gradient" fw="bold">
            {transactionId || 'ID Transaksi tidak ditemukan'}
          </Text>
          <CopyButton value={transactionId} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Berhasil disalin' : 'Salin'} withArrow position="right">
                <ActionIcon
                  variant="light"
                  size="lg"
                  color={copied ? 'teal' : 'gray'}
                  onClick={copy}
                >
                  {copied ? <IconCheck size="1.2rem" /> : <IconCopy size="1.2rem" />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Flex>
      </Paper>
      <Text color="dimmed" fs="italic" size="sm" mb="xl">
        Salin ID Transaksi di atas untuk mencetak struk transaksi
      </Text>
    </Flex>
  );
}
