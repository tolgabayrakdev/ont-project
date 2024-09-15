import { AppShell, Group, Text, Button, Anchor, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { Link, Outlet } from "react-router-dom";
import { IconSun, IconMoon } from '@tabler/icons-react';

export default function AppLayout() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <AppShell
            header={{ height: 60 }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Text size="xl" fw={700}>Ont App</Text>
                    <Group>
                        <Anchor component={Link} to="app/profile">
                            Profil
                        </Anchor>
                        <Anchor mr="xs" component={Link} to="app/settings">
                            Ayarlar
                        </Anchor>
                        <ActionIcon
                            variant="outline"
                            color="blue"
                            onClick={() => toggleColorScheme()}
                            title="Toggle color scheme"
                        >
                            {dark ? <IconSun size="1.1rem" /> : <IconMoon size="1.1rem" />}
                        </ActionIcon>
                        <Button color="red">Çıkış Yap</Button>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}