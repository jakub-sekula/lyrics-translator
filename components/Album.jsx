import {
  Card,
  Image,
  Text,
  Button,
  Group,
  Title,
  Flex,
  Anchor,
} from "@mantine/core";
import Link from "next/link";

export default function Album({ image, artist, title, id, link, getTrackData }) {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section h={250}>
        <Image src={image} height={250} alt="Norway" />
      </Card.Section>

      <Card.Section p="md">
        <Title order={4} size="h6" color="dimmed">
          {artist}
        </Title>
        <Title
          order={2}
          size="h4"
          weight={500}
          style={{ wordBreak: "break-all" }}
        >
          <Anchor href={link}>{title}</Anchor>
        </Title>
        <Text size="sm" color="dimmed">
          Song ID: {id}
        </Text>
        <Button mt="md" onClick={()=>{getTrackData(id)}}>Display song analysis</Button>
      </Card.Section>
    </Card>
  );
}
