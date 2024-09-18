import { useState, useEffect } from 'react';
import { Box, Text, Checkbox, Group, Button, Card, SimpleGrid, ThemeIcon, Tooltip } from '@mantine/core';
import { IconDeviceDesktop, IconBallFootball, IconMusic, IconPalette, IconMicroscope, IconQuestionMark } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications'; 

type Interest = {
  id: number;
  name: string;
  description: string;
};

type UserInterest = {
  id: number;
  user_id: number;
  interest_id: number;
  interest_name: string;
};

type InterestIconKey = keyof typeof interestIcons;

// Sabit icon ve renk eşleştirmeleri
const interestIcons = {
  'Teknoloji': { icon: <IconDeviceDesktop size="1.2rem" />, color: 'blue' },
  'Spor': { icon: <IconBallFootball size="1.2rem" />, color: 'green' },
  'Müzik': { icon: <IconMusic size="1.2rem" />, color: 'yellow' },
  'Sanat': { icon: <IconPalette size="1.2rem" />, color: 'pink' },
  'Bilim': { icon: <IconMicroscope size="1.2rem" />, color: 'violet' },
  // Varsayılan icon ve renk
  'default': { icon: <IconQuestionMark size="1.2rem" />, color: 'gray' },
};

export default function Interest() {
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<UserInterest[]>([]);

  useEffect(() => {
    fetchInterests();
    fetchUserInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/interest/all', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAvailableInterests(data);
    } catch (error) {
      throw error;
    }
  };

  const fetchUserInterests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/interest', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSelectedInterests(data);
    } catch (error) {
      throw error;
    }
  };

  const handleInterestToggle = (interestId: number, interestName: string) => {
    setSelectedInterests(prev => {
      const isSelected = prev.some(interest => interest.interest_id === interestId);
      if (isSelected) {
        return prev.filter(interest => interest.interest_id !== interestId);
      } else {
        return [...prev, { id: 0, user_id: 0, interest_id: interestId, interest_name: interestName }];
      }
    });
  };

  const handleSaveInterests = async () => {
    try {
      const interestIds = selectedInterests.map(interest => interest.interest_id);
      const response = await fetch('http://localhost:8000/api/v1/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ interest_ids: interestIds }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      fetchUserInterests();

      // Başarılı bildirim göster
      notifications.show({
        title: 'Başarılı',
        message: 'İlgi alanları başarıyla kaydedildi',
        color: 'green',
      });
    } catch (error) {

      // Hata bildirimi göster
      notifications.show({
        title: 'Hata',
        message: 'İlgi alanları kaydedilirken bir hata oluştu',
        color: 'red',
      });
    }
  };

  return (
    <Box>
      <Text size="xl" fw={700} mb="md">İlgi Alanları</Text>

      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 3, md: 4 }}
        spacing={{ base: 'xs', sm: 'sm', md: 'md' }}
        mb="xl"
      >
        {availableInterests.map((interest) => {
          const { icon, color } = interestIcons[interest.name as InterestIconKey] || interestIcons['default'];
          const isSelected = selectedInterests.some(si => si.interest_name === interest.name);
          return (
            <Card key={interest.id} shadow="sm" padding="xs" radius="md" withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between" wrap="nowrap">
                  <Group wrap="nowrap">
                    <ThemeIcon color={color} variant="light" size="sm">
                      {icon}
                    </ThemeIcon>
                    <Tooltip
                      label={interest.description}
                      position="bottom"
                      withArrow
                    >
                      <Text size="sm" lineClamp={1}>{interest.name}</Text>
                    </Tooltip>
                  </Group>
                </Group>
              </Card.Section>
              <Checkbox
                mt="xs"
                checked={isSelected}
                onChange={() => handleInterestToggle(interest.id, interest.name)}
                label="İlgileniyorum"
              />
            </Card>
          );
        })}
      </SimpleGrid>
      <Button onClick={handleSaveInterests} mt="md">İlgi Alanlarını Kaydet</Button>
    </Box>
  );
}