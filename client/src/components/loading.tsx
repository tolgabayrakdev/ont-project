import { Center, Loader } from '@mantine/core';

export default function Loading() {
  return (
    <Center style={{ width: '100vw', height: '100vh' }}>
      <Loader size="lg" variant="bars" />
    </Center>
  );
}