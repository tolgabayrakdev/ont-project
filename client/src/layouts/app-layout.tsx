import { AppShell, Group, Text, Button, ActionIcon, useMantineColorScheme, Loader, Burger, Stack } from '@mantine/core';
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { IconSun, IconMoon, IconUser, IconHome } from '@tabler/icons-react';
import { useState } from 'react';
import AuthWrapper from '../wrappers/auth-wrapper';

function AppLayout() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [opened, setOpened] = useState(false);

    const isActive = (path: string) => location.pathname.endsWith(path);

    const buttonColor = dark ? 'gray' : 'dark';
    const activeVariant = dark ? 'light' : 'filled';
    const inactiveVariant = 'subtle';

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const res = await fetch('http://localhost:8000/api/v1/auth/logout', {
            method: 'POST',
            credentials: 'include',
        })
        if (res.status === 200) {
            setTimeout(() => {
                setIsLoggingOut(false);
                navigate('/sign-in');
            }, 1500); // 
        }

    };

    return (
        <>
            <AppShell
                header={{ height: 60 }}
                footer={{ height: 60 }}
                navbar={{
                    width: 220,
                    breakpoint: 'sm',
                    collapsed: { mobile: !opened },
                }}
                padding="md"
            >
                <AppShell.Header>
                    <Group h="100%" px="md" justify="space-between">
                        <Group>
                            <Burger opened={opened} onClick={() => setOpened((o) => !o)} hiddenFrom="sm" size="sm" />
                            <Text size="xl" fw={700}>Ont App</Text>
                        </Group>
                        <Group>
                            <ActionIcon
                                variant="outline"
                                color={buttonColor}
                                onClick={() => toggleColorScheme()}
                                title="Toggle color scheme"
                            >
                                {dark ? <IconSun size="1.1rem" /> : <IconMoon size="1.1rem" />}
                            </ActionIcon>
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

                <AppShell.Navbar p="md" h="100%">
                    <Stack h="100%" justify="space-between">
                        <Stack>
                            <Button
                                component={Link}
                                to="/app"
                                variant={location.pathname === '/app' ? activeVariant : inactiveVariant}
                                color={buttonColor}
                                fullWidth
                                leftSection={<IconHome size="1.2rem" />}
                                styles={{ inner: { justifyContent: 'flex-start' } }}
                            >
                                Ana Sayfa
                            </Button>
                            <Button
                                component={Link}
                                to="profile"
                                variant={isActive('profile') ? activeVariant : inactiveVariant}
                                color={buttonColor}
                                fullWidth
                                leftSection={<IconUser size="1.2rem" />}
                                styles={{ inner: { justifyContent: 'flex-start' } }}
                            >
                                Profil
                            </Button>
                        </Stack>
                    </Stack>
                </AppShell.Navbar>

                <AppShell.Main>
                    <Outlet />
                </AppShell.Main>

                <AppShell.Footer h={50}>
                    <Group h="100%" px="md" justify="center" align="center">
                        <Text>OntApp 2024 Copyright</Text>
                    </Group>
                </AppShell.Footer>
            </AppShell>
        </>
    );
}

export default AuthWrapper(AppLayout);