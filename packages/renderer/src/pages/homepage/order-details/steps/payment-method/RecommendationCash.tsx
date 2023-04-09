import { Box, SimpleGrid, Button } from '@mantine/core';
import { getNominals, convertToRupiah } from '/@/context/helpers';

type Props = {
  total: number;
  onClick: (nominal: number) => void;
};

export default function RecommendationCash({ total, onClick }: Props) {
  const recomendations = getNominals(total);

  return (
    <Box>
      <SimpleGrid cols={3} mb="xl">
        {recomendations.map((nominal, i) => {
          return (
            <Button onClick={() => onClick(nominal)} variant="light" key={i}>
              {convertToRupiah(nominal)}
            </Button>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
