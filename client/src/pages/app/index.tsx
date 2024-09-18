import { useState, useEffect } from "react";
import { Box, Text, Button, Card, Stack, Modal, TextInput, Textarea, Select, Group, MultiSelect, Checkbox, Avatar, ThemeIcon } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { IconDeviceDesktop, IconBallFootball, IconMusic, IconPalette, IconMicroscope, IconQuestionMark } from '@tabler/icons-react';

type Post = {
  id: number;
  title: string;
  content: string;
  interest_name: string;
  author: {
    username: string;
    image_url: string | null;
  };
  created_at: string;
  updated_at: string;
  comments?: Comment[];
}

type Comment = {
  id: number;
  content: string;
  author: {
    username: string;
    image_url: string | null;
  };
  created_at: string;
}

type Interest = {
  id: number;
  user_id: number;
  interest_id: number;
  interest_name: string;
}

const interestIcons = {
  'Teknoloji': { icon: <IconDeviceDesktop size="1.2rem" />, color: 'blue' },
  'Spor': { icon: <IconBallFootball size="1.2rem" />, color: 'green' },
  'Müzik': { icon: <IconMusic size="1.2rem" />, color: 'yellow' },
  'Sanat': { icon: <IconPalette size="1.2rem" />, color: 'pink' },
  'Bilim': { icon: <IconMicroscope size="1.2rem" />, color: 'violet' },
  'default': { icon: <IconQuestionMark size="1.2rem" />, color: 'gray' },
};

type InterestIconKey = keyof typeof interestIcons;

export default function Index() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showAllPosts, setShowAllPosts] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [detailModalOpened, { open: openDetailModal, close: closeDetailModal }] = useDisclosure(false);

  useEffect(() => {
    fetchUserInterestsAndPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedFilters, showAllPosts]);

  const fetchUserInterestsAndPosts = async () => {
    try {
      const interestsRes = await fetch("http://localhost:8000/api/v1/interest", {
        credentials: 'include'
      });
      const interestsData = await interestsRes.json();
      setInterests(interestsData);

      const postsRes = await fetch("http://localhost:8000/api/v1/post", {
        credentials: 'include'
      });
      const postsData = await postsRes.json();
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterPosts = () => {
    if (showAllPosts) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => selectedFilters.includes(post.interest_name)));
    }
  };

  const handlePostShare = async () => {
    if (newPostTitle && newPost && selectedCategory) {
      try {
        const response = await fetch("http://localhost:8000/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({
            title: newPostTitle,
            content: newPost,
            interest_id: interests.find(i => i.interest_name === selectedCategory)?.interest_id
          }),
        });

        if (response.ok) {
          const newPostData = await response.json();
          setPosts(prevPosts => [newPostData, ...prevPosts]);
          setNewPostTitle("");
          setNewPost("");
          setSelectedCategory(null);
          close();
        } else {
          console.error("Failed to create post");
        }
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };

  const handleFilterChange = (values: string[]) => {
    setSelectedFilters(values);
    setShowAllPosts(values.length === 0);
  };

  const handlePostExpand = async (post: Post) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/post/${post.id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const detailedPost = await response.json();
        setSelectedPost(detailedPost);
        openDetailModal();
      } else {
        console.error("Failed to fetch post details");
      }
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>Ana Sayfa</Text>
        <Button onClick={open}>Yeni İçerik Paylaş</Button>
      </Group>

      <MultiSelect
        data={interests.map(interest => ({ value: interest.interest_name, label: interest.interest_name }))}
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
          placeholder="Başlık..."
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.currentTarget.value)}
          mb="sm"
        />
        <Textarea
          placeholder="İçerik..."
          value={newPost}
          onChange={(e) => setNewPost(e.currentTarget.value)}
          minRows={3}
          maxRows={10}
          autosize
          mb="sm"
        />
        <Select
          placeholder="Kategori seçin"
          data={interests.map(i => ({ value: i.interest_name, label: i.interest_name }))}
          value={selectedCategory}
          onChange={setSelectedCategory}
          mb="sm"
        />
        <Button onClick={handlePostShare} disabled={!newPostTitle || !newPost || !selectedCategory}>Paylaş</Button>
      </Modal>

      <Stack>
        {filteredPosts.map((post) => {
          const { icon, color } = interestIcons[post.interest_name as InterestIconKey] || interestIcons['default'];
          return (
            <Card key={post.id} shadow="sm" p="lg">
              <Group mb="xs">
                <Avatar src={post.author.image_url ? "http://localhost:8000" + post.author.image_url : undefined} radius="xl" />
                <Text>{post.author.username}</Text>
              </Group>
              <Text size="lg" fw={700} mb="xs">{post.title}</Text>
              <Text mb="xs">{post.content}</Text>
              <Group>
                <ThemeIcon color={color} variant="light" size="sm">
                  {icon}
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  {post.interest_name}
                </Text>
              </Group>
              <Group p="apart" mt="md">
                <Text size="xs" c="dimmed">Oluşturulma: {new Date(post.created_at).toLocaleString()}</Text>
                <Button variant="subtle" size="xs" onClick={() => handlePostExpand(post)}>
                  Büyült
                </Button>
              </Group>
            </Card>
          );
        })}
      </Stack>

      <Modal opened={detailModalOpened} onClose={closeDetailModal} size="lg" title="Post Detayları">
        {selectedPost && (
          <Box>
            <Group mb="md">
              <Avatar src={selectedPost.author.image_url ? "http://localhost:8000" + selectedPost.author.image_url : undefined} radius="xl" size="lg" />
              <Box>
                <Text size="lg" fw={700}>{selectedPost.author.username}</Text>
                <Text size="sm" c="dimmed">Oluşturulma: {new Date(selectedPost.created_at).toLocaleString()}</Text>
              </Box>
            </Group>
            <Text size="xl" fw={700} mb="sm">{selectedPost.title}</Text>
            <Text mb="md">{selectedPost.content}</Text>
            <Group mb="md">
              <ThemeIcon color={interestIcons[selectedPost.interest_name as InterestIconKey]?.color || 'gray'} variant="light" size="sm">
                {interestIcons[selectedPost.interest_name as InterestIconKey]?.icon || interestIcons['default'].icon}
              </ThemeIcon>
              <Text size="sm" c="dimmed">{selectedPost.interest_name}</Text>
            </Group>
            <Text size="lg" fw={700} mb="sm">Yorumlar</Text>
            {selectedPost.comments && selectedPost.comments.length > 0 ? (
              <Stack>
                {selectedPost.comments.map((comment) => (
                  <Card key={comment.id} shadow="sm" p="sm">
                    <Group mb="xs">
                      <Avatar src={comment.author.image_url ? "http://localhost:8000" + comment.author.image_url : undefined} radius="xl" size="sm" />
                      <Text size="sm" fw={500}>{comment.author.username}</Text>
                    </Group>
                    <Text size="sm">{comment.content}</Text>
                    <Text size="xs" c="dimmed" mt="xs">Oluşturulma: {new Date(comment.created_at).toLocaleString()}</Text>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Text c="dimmed">Henüz yorum yok.</Text>
            )}
          </Box>
        )}
      </Modal>
    </Box>
  )
}