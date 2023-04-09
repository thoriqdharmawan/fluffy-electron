import { UnstyledButton, Checkbox, Text, createStyles, ThemeIcon } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  button: {
    display: 'flex',
    width: '100%',
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
    }`,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.lg,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[0],
    },
  },
}));

interface CheckboxCardProps {
  checked?: string;
  onChange(fieldName: string): void;
  title: React.ReactNode;
  description?: React.ReactNode;
  fieldName: string;
  icon?: React.ReactNode;
  mb?: string | number;
  error?: boolean;
  disabled: boolean;
}

export default function CheckboxCard({
  checked,
  onChange,
  title,
  description,
  className,
  fieldName,
  icon,
  mb,
  error,
  disabled = false,
  ...others
}: CheckboxCardProps & Omit<React.ComponentPropsWithoutRef<'button'>, keyof CheckboxCardProps>) {
  const { classes, cx } = useStyles();

  return (
    <UnstyledButton
      {...others}
      onClick={() => onChange(fieldName)}
      className={cx(classes.button, className)}
      mb={mb || 'sm'}
      sx={{ borderColor: error ? 'red' : 'none' }}
      disabled={disabled}
    >
      <Checkbox
        error={error}
        checked={checked === fieldName || false}
        onChange={() => {}}
        tabIndex={-1}
        size="md"
        mr="xl"
        styles={{ input: { cursor: 'pointer' } }}
        disabled={disabled}
      />

      <ThemeIcon variant="light" radius="md" mr="sm">
        {icon}
      </ThemeIcon>

      <div>
        <Text weight={500}>{title}</Text>
        {description && (
          <Text size="sm" mt="sm" color="dimmed">
            {description}
          </Text>
        )}
      </div>
    </UnstyledButton>
  );
}
