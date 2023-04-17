import { Chip as C, Group } from '@mantine/core';

interface ChipsInterface {
  label: string;
  value: string | number;
  checked: boolean
}

type Props = {
  data: ChipsInterface[];
  onChange: (v: string) => void;
}

export default function Chips(props: Props) {
  const { data, onChange } = props
  return (
    <C.Group onChange={onChange} mb="xl">
      <Group position="center">
        {data.map(({ label, value, checked }, idx) => (
          <C checked={checked} key={idx} value={value}>{label}</C>
        ))}
      </Group>
    </C.Group>
  )
}