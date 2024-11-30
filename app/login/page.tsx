'use client';

import { useActionState } from 'react';

import { login } from './actions';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Group
} from '@mantine/core';

export default function LoginPage() {
  const [stateLogin, formLoginAction, pending] = useActionState(login, {
    message: ''
  });

  // const [stateSignUp, formSignUpAction, pendingSignUp] = useActionState(
  //   signup,
  //   {
  //     message: ''
  //   }
  // );

  return (
    <form>
      <Container size={420} my={80}>
        <Title>Ish stoliga xush kelibsiz</Title>
        <Text c="dimmed" size="sm" align="center" mt={5}>
          Hisobingizga kirish uchun ma'lumotlaringizni kiriting
        </Text>

        {stateLogin.message && (
          <Text c={'red'} size="sm" align="center" mt={5}>
            {stateLogin.message}
          </Text>
        )}

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            name="email"
            label="E-mail"
            placeholder="siz@mail.com"
            required
            autoComplete="off"
          />
          <PasswordInput
            name="password"
            label="Parol"
            placeholder="Sizning parol"
            mt="md"
            required
            autoComplete="off"
          />
          <Group>
            <Button
              fullWidth
              mt="xl"
              type="submit"
              formAction={formLoginAction}
              disabled={pending}
              loading={pending}
            >
              Kirish
            </Button>
            {/* <Button
              fullWidth
              mt="sm"
              type="submit"
              formAction={formSignUpAction}
            >
              Ro'yhatdan o'tish
            </Button> */}
          </Group>
        </Paper>
      </Container>
    </form>
  );
}
