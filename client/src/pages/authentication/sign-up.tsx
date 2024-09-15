import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useForm } from '@mantine/form';

export default function SignUp() {
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

    const handleSubmit = form.onSubmit((values) => {
        console.log(values);
        // Burada kayıt işlemini gerçekleştirin
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
                    <Button type="submit" fullWidth mt="xl">
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