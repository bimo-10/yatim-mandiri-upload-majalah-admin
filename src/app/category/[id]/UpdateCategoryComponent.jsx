"use client";
import { Button, Container, Group, Input } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function UpdateCategoryComponent({ id, category }) {
  // console.log(id, category);
  const router = useRouter();
  const { data } = category;

  const [isLoading, setIsLoading] = useState(false);

  console.log(data);

  const [isCategory, setIsCategory] = useState(data.name);

  const handleUpdate = async () => {
    setIsLoading(true);
    const response = await fetch(`/api/category/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: isCategory,
      }),
      cache: "no-store",
    });

    const data = await response.json();
    console.log(data);

    setIsLoading(false);

    router.refresh();
    router.push("/category");
  };
  return (
    <>
      <Container fluid my={"xl"}>
        <Group>
          <Input
            label="Category Name"
            placeholder="Insert New Category Name..."
            onChange={(e) => setIsCategory(e.target.value)}
            value={isCategory}
          />
          <Button onClick={handleUpdate} loading={isLoading}>
            Update
          </Button>
        </Group>
      </Container>
    </>
  );
}
