import { Button, Flex, Title } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <main className="flex justify-center items-center min-h-screen">
        <Flex
          direction={"column"}
          gap={"sm"}
          justify={"center"}
          align={"center"}
        >
          <Title order={1}>Page Not Found</Title>
          <Link href="/">
            <Button color="red" radius="md" size="md" variant="outline">
              Back to Home
            </Button>
          </Link>
        </Flex>
      </main>
    </>
  );
}
