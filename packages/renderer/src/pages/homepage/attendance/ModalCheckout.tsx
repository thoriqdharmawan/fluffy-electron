import React, { useState } from 'react';
import { Button, Modal, NumberInput, TextInput, Text } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useMutation } from '@apollo/client';

import { DONE_WORK } from '../../../services/attendace';
import client from '../../../apollo-client';

interface Props {
  opened: boolean;
  attendanceId: string;
  name: string;
  onClose: () => void;
  onDoneWork: () => void;
}

interface FormValues {
  money_in_drawer_end?: number;
  note_end?: string;
}

export default function ModalCheckout(props: Props) {
  const { opened, attendanceId, name, onClose, onDoneWork } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const [doneWork] = useMutation(DONE_WORK, { client });

  const form = useForm<FormValues>({
    initialValues: {
      money_in_drawer_end: undefined,
      note_end: undefined,
    },
    validate: {
      money_in_drawer_end: isNotEmpty('Bagian ini diperlukan'),
    },
  });

  const handleClose = () => {
    onDoneWork();
    onClose();
    form.reset();
  };

  const handleSubmit = () => {
    const { hasErrors } = form.validate();

    if (!hasErrors) {
      setLoading(true);
      doneWork({
        variables: {
          id: attendanceId,
          money_in_drawer_end: form.values.money_in_drawer_end,
        },
      })
        .then(() => {
          handleClose();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose}>
      <Text fw="bold" size="xl" mb="xl">
        {name}
      </Text>

      <NumberInput
        label="Uang di Laci Saat Ini"
        placeholder="Tambahkan Jumlah Uang di Laci"
        mb="sm"
        icon="Rp"
        min={0}
        withAsterisk
        hideControls
        labelProps={{ mb: 8 }}
        parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
        formatter={(value: any) =>
          !Number.isNaN(parseFloat(value)) ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
        }
        {...form.getInputProps('money_in_drawer_end')}
      />
      <TextInput
        placeholder="Tambahkan Catatan"
        label="Catatan"
        mb="sm"
        labelProps={{ mb: 8 }}
        {...form.getInputProps('note_end')}
      />

      <Button loading={loading} onClick={handleSubmit} display="block" ml="auto" mt={44}>
        Selesaikan Pekerjaan Sekarang 🚀🚀
      </Button>
    </Modal>
  );
}
