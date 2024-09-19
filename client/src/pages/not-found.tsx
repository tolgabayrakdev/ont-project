import { Center, Text } from "@mantine/core"

type Props = {}

export default function NotFound({ }: Props) {
    return (
        <Center style={{ width: '100vw', height: '100vh' }}>
            <Text>404 - Not Found!</Text>
        </Center>

    )
}