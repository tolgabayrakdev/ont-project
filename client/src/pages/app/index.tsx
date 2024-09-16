import { Box, Text } from "@mantine/core"

type Props = {}

export default function Index({ }: Props) {
  return (
    <Box>
      <Text size="xl" fw={700} mb="md">Ana Sayfa</Text>
      <Text>Hoş geldiniz! Bu, uygulamanızın ana sayfasıdır.</Text>
    </Box>
  )
}