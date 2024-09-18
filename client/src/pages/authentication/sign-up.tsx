import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Anchor } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validate: {
            username: (value) => (value.length < 3 ? 'Kullanıcı adı en az 3 karakter olmalıdır' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Geçerli bir e-posta adresi girin'),
            password: (value) => (value.length < 6 ? 'Şifre en az 6 karakter olmalıdır' : null),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Şifreler eşleşmiyor' : null,
        },
    });

    const handleSubmit = form.onSubmit(async (values) => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    password: values.password
                })
            })
            if (res.status === 201) {
                notifications.show({
                    title: 'Hesap oluşturuldu',
                    message: 'Giriş Ekranına Yönlendiriliyorsunuz...',
                    color: 'green',
                    withCloseButton: false,
                    autoClose: 1500
                  })
                setTimeout(() => {
                    setLoading(false);
                    navigate("/sign-in");
                }, 1500)
            } else {
                setTimeout(() => {
                    setLoading(false);
                    notifications.show({
                        title: 'Hata',
                        message: 'E-posta ya da sifre hatalı',
                        color: 'yellow',
                        withCloseButton: false,
                        autoClose: 1500
                    })
                }, 1500)
            }
        } catch (error) {
            setLoading(false)
            throw error;
        }
    });

    return (
        <Container size={420} my={40}>
            <Title ta="center">Kayıt Ol</Title>
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <form onSubmit={handleSubmit}>
                    <TextInput
                        label="Kullanıcı Adı"
                        placeholder="Kullanıcı adınız"
                        required
                        {...form.getInputProps('username')}
                    />
                    <TextInput
                        label="E-posta"
                        placeholder="ornek@email.com"
                        required
                        mt="md"
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput
                        label="Şifre"
                        placeholder="Şifreniz"
                        required
                        mt="md"
                        {...form.getInputProps('password')}
                    />
                    <PasswordInput
                        label="Şifre Onayı"
                        placeholder="Şifrenizi tekrar girin"
                        required
                        mt="md"
                        {...form.getInputProps('confirmPassword')}
                    />
                    <Button loading={loading} type="submit" fullWidth mt="xl">
                        Kayıt Ol
                    </Button>
                </form>
                <Text ta="center" mt="md">
                    Zaten hesabınız var mı?{' '}
                    <Anchor component={Link} to="/sign-in">
                        Giriş yap
                    </Anchor>
                </Text>
            </Paper>
        </Container>
    );
}