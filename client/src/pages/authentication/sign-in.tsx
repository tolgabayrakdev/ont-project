import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Anchor, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useForm } from '@mantine/form';

export default function SignIn() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçerli bir e-posta adresi girin'),
      password: (value) => (value.length < 6 ? 'Şifre en az 6 karakter olmalıdır' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
    // Burada giriş işlemini gerçekleştirin
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center">Giriş Yap</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="E-posta"
            placeholder="ornek@email.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Şifre"
            placeholder="Şifreniz"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Group p="apart" mt="sm">
            <Anchor component={Link} to="/forgot-password" size="sm">
              Şifremi unuttum
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="lg">
            Giriş Yap
          </Button>
        </form>
        <Text ta="center" mt="md">
          Hesabınız yok mu?{' '}
          <Anchor component={Link} to="/sign-up">
            Kayıt ol
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}