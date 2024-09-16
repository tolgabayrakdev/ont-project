import { Tabs, Text, TextInput, Button, PasswordInput, Box } from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<string | null>('profile');

  const handleProfileUpdate = () => {
    // Burada profil güncelleme işlemini gerçekleştirin
    // Örnek olarak başarılı olduğunu varsayalım
    notifications.show({
      title: 'Profil Güncellendi',
      message: 'Profil bilgileriniz başarıyla güncellendi.',
      color: 'green',
      icon: <IconCheck size="1.1rem" />,
      position: 'top-right',
      autoClose: 1500
    });
  };

  const handlePasswordChange = () => {
    // Burada şifre değiştirme işlemini gerçekleştirin
    // Örnek olarak başarılı olduğunu varsayalım
    notifications.show({
      title: 'Şifre Değiştirildi',
      message: 'Şifreniz başarıyla değiştirildi.',
      color: 'green',
      icon: <IconCheck size="1.1rem" />,
      position: 'top-right',
      autoClose: 1500
    });
  };

  return (
    <Box>
      <Text size="xl" fw={700} mb="md">Profil</Text>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="profile">Profil Bilgileri</Tabs.Tab>
          <Tabs.Tab value="password">Şifre Değiştir</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <Box mt="md">
            <TextInput
              label="Kullanıcı Adı"
              placeholder="Kullanıcı adınız"
              mb="sm"
            />
            <TextInput
              label="E-posta"
              placeholder="E-posta adresiniz"
              mb="sm"
            />
            <Button onClick={handleProfileUpdate}>Bilgileri Güncelle</Button>
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="password">
          <Box mt="md">
            <PasswordInput
              label="Mevcut Şifre"
              placeholder="Mevcut şifrenizi girin"
              mb="sm"
            />
            <PasswordInput
              label="Yeni Şifre"
              placeholder="Yeni şifrenizi girin"
              mb="sm"
            />
            <PasswordInput
              label="Yeni Şifre (Tekrar)"
              placeholder="Yeni şifrenizi tekrar girin"
              mb="sm"
            />
            <Button onClick={handlePasswordChange}>Şifreyi Değiştir</Button>
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}