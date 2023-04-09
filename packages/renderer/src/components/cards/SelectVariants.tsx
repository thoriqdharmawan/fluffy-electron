import { Box, Chip, Title } from '@mantine/core';

type Props = {
  title: string;
  variants: string[];
  value?: string;
  onChange: (value: string) => void;
};

export default function SelectVariants({ title, variants, value, onChange }: Props) {
  return (
    <Box mb="md">
      <Title order={6} mb="xs">
        {title}
      </Title>
      <Chip.Group value={value} onChange={onChange} position="left">
        {variants?.map((variant, idx) => (
          <Chip checked={value === variant} key={idx} value={variant}>
            {variant}
          </Chip>
        ))}
      </Chip.Group>
    </Box>
  );
}
