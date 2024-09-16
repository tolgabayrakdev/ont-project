import { Tabs, Text, TextInput, Button, PasswordInput, Box, Group, Modal, Avatar, FileButton } from '@mantine/core';
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconTrash, IconUpload, IconX } from '@tabler/icons-react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/auth/verify', {
          method: "POST",
          credentials: 'include' // Eğer API çağrısı için kimlik doğrulama gerekiyorsa
        });
        if (!response.ok) {
          throw new Error('Sunucu yanıtı başarısız');
        }
        const userData = await response.json();
        console.log(userData);
        setUsername(userData.user.username);
        setEmail(userData.user.email);
        setAvatarUrl(userData.user.photo); // Kullanıcının mevcut avatar URL'sini ayarla
      } catch (error) {
        console.error('Kullanıcı bilgileri alınamadı:', error);
        notifications.show({
          title: 'Hata',
          message: 'Kullanıcı bilgileri yüklenirken bir hata oluştu.',
          color: 'red',
          withCloseButton: false,
        });
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = () => {
    if (isEditing) {
      // Burada profil güncelleme işlemini gerçekleştirin
      console.log('Profil bilgileri güncellendi:', { username, email });

      notifications.show({
        title: 'Profil Güncellendi',
        message: 'Profil bilgileriniz başarıyla güncellendi.',
        color: 'green',
        icon: <IconCheck size="1.1rem" />,
        withCloseButton: false,
        autoClose: 1500
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handlePasswordChange = () => {
    // Burada şifre değiştirme işlemini gerçekleştirin
    // Örnek olarak başarılı olduğunu varsayalım
    notifications.show({
      title: 'Şifre Değiştirildi',
      message: 'Şifreniz başarıyla değiştirildi.',
      color: 'green',
      icon: <IconCheck size="1.1rem" />,
      withCloseButton: false,
      autoClose: 1500
    });
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAccount = () => {
    // Burada gerçek hesap silme işlemini gerçekleştirin
    console.log('Hesap silme işlemi onaylandı');
    notifications.show({
      title: 'Hesap Silindi',
      message: 'Hesabınız başarıyla silindi.',
      color: 'red',
      icon: <IconTrash size="1.1rem" />,
      withCloseButton: false,
      position: 'top-right',
      autoClose: 3000
    });
    setIsDeleteModalOpen(false);
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (file) {
      const res = await fetch('http://localhost:8000/api/v1/user/update-photo', {
        method: 'PUT',
        credentials: 'include',
        body: file
      })
      if (res.status === 200) {
        const imageUrl = URL.createObjectURL(file);
        setAvatarUrl(imageUrl);

        notifications.show({
          title: 'Profil Resmi Güncellendi',
          message: 'Profil resminiz başarıyla güncellendi.',
          color: 'green',
          icon: <IconCheck size="1.1rem" />,
          withCloseButton: false,
          autoClose: 1500
        });
      }

    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarUrl(null);
    const res = await fetch('http://localhost:8000/api/v1/user/delete-photo', {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.status === 200) {
      notifications.show({
        title: 'Profil Resmi Kaldırıldı',
        message: 'Profil resminiz başarıyla kaldırıldı.',
        color: 'blue',
        icon: <IconX size="1.1rem" />,
        withCloseButton: false,
        autoClose: 1500
      });
    };
  }

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
            <Group mb="md">
              <Avatar src={avatarUrl} size="xl" radius="xl" />
              <Box>
                <FileButton onChange={handleAvatarUpload} accept="image/png,image/jpeg">
                  {(props) => <Button {...props} leftSection={<IconUpload size="1rem" />}>Resim Yükle</Button>}
                </FileButton>
                {avatarUrl && (
                  <Button ml="xs" color="red" onClick={handleRemoveAvatar} leftSection={<IconTrash size="1rem" />}>
                    Resmi Kaldır
                  </Button>
                )}
              </Box>
            </Group>
            <TextInput
              label="Kullanıcı Adı"
              placeholder="Kullanıcı adınız"
              mb="sm"
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
              disabled={!isEditing}
            />
            <TextInput
              label="E-posta"
              placeholder="E-posta adresiniz"
              mb="sm"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              disabled={!isEditing}
            />
            <Group p="apart" mt="md">
              <Button onClick={handleProfileUpdate}>
                {isEditing ? 'Kaydet' : 'Bilgileri Güncelle'}
              </Button>
              <Button color="red" onClick={handleDeleteAccount} leftSection={<IconTrash size="1rem" />}>
                Hesabı Sil
              </Button>
            </Group>
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

      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hesabı Sil"
        centered
      >
        <Text>Bu işlem geri alınamaz. Hesabınızı silmek istediğinizden emin misiniz?</Text>
        <Group p="right" mt="md">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>İptal</Button>
          <Button color="red" onClick={confirmDeleteAccount}>Hesabı Sil</Button>
        </Group>
      </Modal>
    </Box>
  );
}