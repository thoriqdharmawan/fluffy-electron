import { createStyles } from '@mantine/core';
import Skeleton from 'react-loading-skeleton';

type Props = {
  height?: number | string;
  width?: number | string;
  count?: number;
  direction?: string;
};

const useStyles = createStyles(() => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function Loading(props: Props) {
  const { classes } = useStyles();
  const { height = 46, count = 6, width = '100%', direction = 'column' } = props;

  return (
    <Skeleton
      width={width}
      height={height}
      count={count}
      containerClassName={direction === 'row' ? classes.row : classes.column}
    />
  );
}
