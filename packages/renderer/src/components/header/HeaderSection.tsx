import { ActionIcon, Box, Flex, Text, createStyles } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  wrapper: {
    marginBottom: theme.fontSizes.xl,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: theme.fontSizes.md,
      flexDirection: 'column',
    },
  },
}));

type Props = {
  onBack?: () => void;
  title: string;
  label: string;
  action?: JSX.Element[] | JSX.Element;
};

export default function HeaderSection({ title, label, action, onBack }: Props) {
  const { classes } = useStyles();

  return (
    <Flex align="center" justify="space-between" className={classes.wrapper}>
      <Box maw={700}>
        <Flex align="center" mb="md">
          {onBack && (
            <ActionIcon onClick={onBack} size="lg" radius="md" mr="sm" color="blue">
              <IconChevronLeft size={18} />
            </ActionIcon>
          )}
          <Text size="xl" fw={600}>
            {title}
          </Text>
        </Flex>
        <Text color="dimmed" size="sm">
          {label}
        </Text>
      </Box>

      {action}
    </Flex>
  );
}
