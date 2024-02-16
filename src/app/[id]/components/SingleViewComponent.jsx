"use client";

import { Anchor, Badge, Button, Card, Group, Text } from "@mantine/core";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";

export default function SingleViewComponent({ post }) {
  // const x = post.content.length;
  // console.log(x);
  console.log(post);

  function createMarkup() {
    return { __html: post.content };
  }

  return (
    <>
      <section className="my-6 flex justify-center mx-20">
        <Card shadow="sm" padding="lg" radius="md" withBorder className="w-1/2">
          <Card.Section className="flex justify-center">
            <Image
              src={`/images/${post.image}`}
              width={200}
              height={200}
              alt={post.image}
              className="w-full h-72 rounded-md"
            />
          </Card.Section>

          <Group position="justify-between" my="md">
            <Text my={12}>
              Date Release:{" "}
              <Badge color="blue">
                {moment(post.date).format("DD-MM-YYYY")}
              </Badge>
            </Text>
          </Group>

          <Group>
            <Anchor href={`/pdf/${post.pdf}`}>{post.pdf}</Anchor>
          </Group>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500} size="xl">
              {post.title}
            </Text>
            <Group>
              {post.categories.map((category) => (
                <Badge color="blue" variant="light" key={category.id}>
                  {category.name}
                </Badge>
              ))}
            </Group>
          </Group>

          <div className="overflow-auto">
            <div
              // dangerouslySetInnerHTML={{
              //   __html: post.content,
              // }}
              dangerouslySetInnerHTML={createMarkup()}
            />
          </div>
        </Card>
      </section>
    </>
  );
}
