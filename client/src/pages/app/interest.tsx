import { useState, useEffect } from 'react';
import { Box, Text, Checkbox, Group, Button, Badge, ThemeIcon, Tooltip, Card, SimpleGrid } from '@mantine/core';
import { IconDeviceDesktop, IconBallFootball, IconMusic, IconPalette, IconMicroscope } from '@tabler/icons-react';

type Interest = {
  name: string;
  postCount: number;
  icon: React.ReactNode;
  color: string;
  description: string;
};

const interestData: Interest[] = [
  {
    name: 'Teknoloji',
    postCount: 0,
    icon: <IconDeviceDesktop size="1.2rem" />,
    color: 'blue',
    description: 'Yazılım, donanım ve yeni teknolojik gelişmeler hakkında paylaşımlar'
  },
  {
    name: 'Spor',
    postCount: 0,
    icon: <IconBallFootball size="1.2rem" />,
    color: 'green',
    description: 'Çeşitli spor dalları, fitness ve sağlıklı yaşam hakkında içerikler'
  },
  {
    name: 'Müzik',
    postCount: 0,
    icon: <IconMusic size="1.2rem" />,
    color: 'yellow',
    description: 'Müzik türleri, sanatçılar ve enstrümanlar hakkında paylaşımlar'
  },
  {
    name: 'Sanat',
    postCount: 0,
    icon: <IconPalette size="1.2rem" />,
    color: 'pink',
    description: 'Resim, heykel, fotoğrafçılık ve diğer sanat dalları ile ilgili içerikler'
  },
  {
    name: 'Bilim',
    postCount: 0,
    icon: <IconMicroscope size="1.2rem" />,
    color: 'violet',
    description: 'Bilimsel keşifler, araştırmalar ve ilginç bilimsel gerçekler'
  },
];

export default function Interest() {
  const [availableInterests, setAvailableInterests] = useState<Interest[]>(interestData);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  useEffect(() => {
    // Burada sunucudan ilgi alanları ve post sayıları alınabilir
    // Örnek: fetchInterestsAndPostCounts();
  }, []);

  const handleInterestToggle = (interestName: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestName)
        ? prev.filter(i => i !== interestName)
        : [...prev, interestName]
    );
  };

  const handleSaveInterests = () => {
    // Seçilen ilgi alanlarını sunucuya kaydetme işlemi
    console.log('Kaydedilen ilgi alanları:', selectedInterests);
    // Örnek: saveUserInterests(selectedInterests);
  };

  return (
    <Box>
      <Text size="xl" fw={700} mb="md">İlgi Alanları</Text>

      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 3, md: 4 }}
        spacing={{ base: 'xs', sm: 'sm', md: 'md' }}
        mb="xl"
      >
        {availableInterests.map((interest) => (
          <Card key={interest.name} shadow="sm" padding="xs" radius="md" withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group justify="space-between" wrap="nowrap">
                <Group wrap="nowrap">
                  <ThemeIcon color={interest.color} variant="light" size="sm">
                    {interest.icon}
                  </ThemeIcon>
                  <Tooltip
                    label={interest.description}
                    position="bottom"
                    withArrow
                  >
                    <Text size="sm" lineClamp={1}>{interest.name}</Text>
                  </Tooltip>
                </Group>
                <Badge color={interest.color} size="sm">{interest.postCount}</Badge>
              </Group>
            </Card.Section>
            <Checkbox
              mt="xs"
              size="xs"
              label="İlgileniyorum"
              checked={selectedInterests.includes(interest.name)}
              onChange={() => handleInterestToggle(interest.name)}
            />
          </Card>
        ))}
      </SimpleGrid>
      <Button onClick={handleSaveInterests}>İlgi Alanlarını Kaydet</Button>
    </Box>
  );
}