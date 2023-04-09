import { Card, Image, Text } from '@mantine/core';

interface ProductCard {
  src?: string;
  name: string;
  price: string;
  onClick: () => void;
}

export default function ProductCardV2(props: ProductCard) {
  const { src, name, price, onClick } = props;

  return (
    <Card
      sx={{
        transitionTimingFunction: 'ease-in-out',
        cursor: 'pointer',
        '&:active': {
          transform: 'translateY(6px)',
        },
      }}
      onClick={onClick}
      shadow="md"
      p="lg"
      radius="md"
    >
      <Card.Section>
        <Image
          radius={0}
          height={160}
          width="100%"
          mb="md"
          src={src}
          alt={name}
          withPlaceholder
          placeholder={<Text sx={{ userSelect: 'none' }}>{name}</Text>}
          sx={{ userSelect: 'none' }}
        />
      </Card.Section>

      <Text weight={500} sx={{ userSelect: 'none' }}>
        {name}
      </Text>

      <Text size="sm" color="dimmed" sx={{ userSelect: 'none' }}>
        {price}
      </Text>
    </Card>
  );
}
