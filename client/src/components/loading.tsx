import { Center, Loader, useMantineColorScheme } from '@mantine/core';

export default function Loading() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Center style={{ width: '100vw', height: '100vh' }}>
      <Loader size="lg" variant="bars" color={dark ? 'white' : 'dark'} />
    </Center>
  );
}