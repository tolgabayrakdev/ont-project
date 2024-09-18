import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

function App() {
  return (
    <MantineProvider>
      <Notifications />
      {/* Diğer bileşenleriniz */}
    </MantineProvider>
  );
}

export default App;