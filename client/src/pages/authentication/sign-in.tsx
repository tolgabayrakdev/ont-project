import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Anchor, Group } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      })
      if (res.status === 200) {
        notifications.show({
          title: 'Giriş Basarılı',
          message: 'Yönlendiriliyorsunuz...',
          color: 'green',
          position: 'top-right',
          autoClose: 1500
        })
        setTimeout(() => {
          setLoading(false);
          navigate('/app');
        }, 1000)
      } else {
        setTimeout(() => {
          setLoading(false);
          notifications.show({
            title: 'Hata',
            message: 'E-posta ya da sifre hatalı',
            color: 'yellow',
            position: 'top-right',
            autoClose: 1500
          })
        }, 1000)
      }
    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: 'Beklenmedik bir hata oluştu',
        color: 'red',
        position: 'top-right',
        autoClose: 1500
      })
      setLoading(false);
      throw error;
    }
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
          <Button loading={loading} type="submit" fullWidth mt="lg">
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