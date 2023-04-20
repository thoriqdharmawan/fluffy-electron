import { TextInput, Button, Group, Box, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { SignIn } from '/@/authentication';

type formLoginType = {
  email: string;
  password: string;
};

export default function index() {
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  const form = useForm({
    initialValues: {
      email: 'arion@arion.com',
      password: 'arionjaya123',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length > 6 ? null : 'Min. 6 characters'),
    },
  });

  const handleSubmit = async (values: formLoginType) => {
    const { email, password } = values;

    try {
      SignIn(email, password).then(() => {
        navigate('/');
      }).catch((err) => {
        setError(JSON.stringify(err))
      })
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <TextInput
          withAsterisk
          label="Password"
          type="password"
          placeholder="Input your password"
          {...form.getInputProps('password')}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
        {error && (
          <Text color="red">{error}</Text>
        )}
      </form>
    </Box>
  );
}
