import { AppShell, Group, Text, Button, ActionIcon, useMantineColorScheme, Loader } from '@mantine/core';
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useState } from 'react';

export default function AppLayout() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const isActive = (path: string) => location.pathname.endsWith(path);

    const buttonColor = dark ? 'gray' : 'dark';
    const activeVariant = dark ? 'light' : 'filled';
    const inactiveVariant = 'subtle';

    const handleLogout = () => {
        setIsLoggingOut(true);
        // Burada çıkış işlemlerini gerçekleştirin (örneğin, API çağrısı)
        setTimeout(() => {
            setIsLoggingOut(false);
            navigate('/sign-in'); // sign-in sayfasına yönlendir
        }, 2000); // 2 saniye sonra yönlendir (simülasyon amaçlı)
    };

    return (
        <AppShell
            header={{ height: 60 }}
            footer={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Text size="xl" fw={700}>Ont App</Text>
                    <Group>
                        <Button
                            component={Link}
                            to="profile"
                            variant={isActive('profile') ? activeVariant : inactiveVariant}
                            color={buttonColor}
                        >
                            Profil
                        </Button>
                        <Button
                            component={Link}
                            to="settings"
                            variant={isActive('settings') ? activeVariant : inactiveVariant}
                            color={buttonColor}
                        >
                            Ayarlar
                        </Button>
                        <Button
                            color="red"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <>
                                    <Loader size="sm" color="red" mr="xs" />
                                    Çıkış yapılıyor
                                </>
                            ) : (
                                'Çıkış Yap'
                            )}
                        </Button>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>

            <AppShell.Footer style={{ border: 0 }}>
                <Group h="100%" px="md" p="right">
                    <ActionIcon
                        variant="outline"
                        color={buttonColor}
                        onClick={() => toggleColorScheme()}
                        title="Toggle color scheme"
                    >
                        {dark ? <IconSun size="1.1rem" /> : <IconMoon size="1.1rem" />}
                    </ActionIcon>
                </Group>
            </AppShell.Footer>
        </AppShell>
    );
}