import { createStyles, Group, Paper, Text, ThemeIcon, SimpleGrid, Title } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons';

import Loading from '/@/components/loading/Loading';

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

interface IncomesProps {
  data: { title: string; value: string; description: string }[];
  loading: boolean;
}

const Incomes = ({ data, loading }: IncomesProps) => {
  const { classes } = useStyles();

  const stats = data.map((stat) => {
    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
          <div>
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs" className={classes.label}>
              {stat.title}
            </Text>
            <Text fw={700} fz="xl">
              {loading ? (
                <Loading count={1} width={250} height={31} direction="row" />
              ) : (
                stat.value
              )}
            </Text>
          </div>
          <ThemeIcon
            color="gray"
            variant="light"
            sx={(theme) => ({ color: theme.colors.teal[6] })}
            size={38}
            radius="md"
          >
            <IconArrowUpRight size="1.8rem" stroke={1.5} />
          </ThemeIcon>
        </Group>
        <Text c="dimmed" fz="sm" mt="md">
          {stat.description}
        </Text>
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      
      <Title order={6} mb="md">
        Ringkasan
      </Title>
      <SimpleGrid mb="xl" cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {stats}
      </SimpleGrid>
    </div>
  );
}

export default Incomes