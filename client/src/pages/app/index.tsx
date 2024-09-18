import { useState, useEffect } from "react";
import { Box, Text, Button, Card, Stack, Modal, TextInput, Select, Group, MultiSelect, Checkbox, Avatar } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';

type Post = {
  id: number;
  content: string;
  category: string;
  comments: string[];
  author: {
    name: string;
    avatar: string;
  };
}

export default function Index() {
  const [interests, setInterests] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showAllPosts, setShowAllPosts] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    fetchUserInterestsAndPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedFilters, showAllPosts]);

  const fetchUserInterestsAndPosts = async () => {
    // Bu fonksiyon sunucudan kullanıcının ilgi alanlarını ve ilgili postları getirecek
    // Örnek veri:
    setInterests(["Teknoloji", "Spor", "Müzik", "Sanat", "Bilim"]);
    setPosts([
      { id: 1, content: "Yeni bir teknoloji gelişmesi", category: "Teknoloji", comments: [], author: { name: "Ali Yılmaz", avatar: "https://i.pravatar.cc/150?img=1" } },
      { id: 2, content: "Bugünkü maç sonuçları", category: "Spor", comments: [], author: { name: "Ayşe Demir", avatar: "https://i.pravatar.cc/150?img=2" } },
      { id: 3, content: "Yeni çıkan albüm", category: "Müzik", comments: [], author: { name: "Mehmet Kaya", avatar: "https://i.pravatar.cc/150?img=3" } },
      { id: 4, content: "Sanat galerisi açılışı", category: "Sanat", comments: [], author: { name: "Zeynep Çelik", avatar: "https://i.pravatar.cc/150?img=4" } },
      { id: 5, content: "Bilimsel keşif", category: "Bilim", comments: [], author: { name: "Emre Şahin", avatar: "https://i.pravatar.cc/150?img=5" } },
    ]);
  };

  const filterPosts = () => {
    if (showAllPosts) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => selectedFilters.includes(post.category)));
    }
  };

  const handlePostShare = () => {
    if (newPost && selectedCategory) {
      const newPostObj: Post = {
        id: Date.now(),
        content: newPost,
        category: selectedCategory,
        comments: [],
        author: {
          name: "Mevcut Kullanıcı", // Bu kısmı gerçek kullanıcı bilgisiyle değiştirin
          avatar: "https://i.pravatar.cc/150?img=0" // Bu kısmı gerçek kullanıcı avatarıyla değiştirin
        }
      };
      setPosts(prevPosts => [newPostObj, ...prevPosts]);
      setNewPost("");
      setSelectedCategory(null);
      close();
    }
  };

  const handleFilterChange = (values: string[]) => {
    setSelectedFilters(values);
    setShowAllPosts(values.length === 0);
  };

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>Ana Sayfa</Text>
        <Button onClick={open}>Yeni İçerik Paylaş</Button>
      </Group>

      <MultiSelect
        data={interests}
        value={selectedFilters}
        onChange={handleFilterChange}
        placeholder="İlgi alanlarına göre filtrele"
        mb="md"
      />

      <Checkbox
        label="Tüm gönderileri göster"
        checked={showAllPosts}
        onChange={(event) => setShowAllPosts(event.currentTarget.checked)}
        mb="md"
      />

      <Modal opened={opened} onClose={close} title="Yeni İçerik Paylaş">
        <TextInput
          placeholder="İçerik..."
          value={newPost}
          onChange={(e) => setNewPost(e.currentTarget.value)}
          mb="sm"
        />
        <Select
          placeholder="Kategori seçin"
          data={interests}
          value={selectedCategory}
          onChange={setSelectedCategory}
          mb="sm"
        />
        <Button onClick={handlePostShare} disabled={!newPost || !selectedCategory}>Paylaş</Button>
      </Modal>

      <Stack>
        {filteredPosts.map((post) => (
          <Card key={post.id} shadow="sm" p="lg">
            <Group mb="xs">
              <Avatar src={post.author.avatar} radius="xl" />
              <Text>{post.author.name}</Text>
            </Group>
            <Text mb="xs">{post.content}</Text>
            <Text size="sm" color="dimmed" mb="md">Kategori: {post.category}</Text>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}