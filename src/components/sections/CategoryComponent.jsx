"use client";
import { Button, Flex, Grid, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";

export default function CategoryComponent({ categories }) {
  const router = useRouter();

  // console.log(categories);

  // DELETE CATEGORY
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/category/${id}`, {
        method: "DELETE",
        data: { id: id },
      });
      const data = await res.json();
      console.log(data);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  // categories.sort((a, b) => b.id - a.id);
  // console.log(categories);

  return (
    <>
      <section className="p-8">
        {/* {JSON.stringify(category)} */}

        {/* MAPPING CATEGORIES */}
        <Grid>
          {categories.map((category) => {
            return (
              <Grid.Col span={3} key={category.id}>
                <Flex align="center">
                  <Title order={3}>
                    {category.name.charAt(0).toUpperCase() +
                      category.name.slice(1)}
                  </Title>
                </Flex>
                <Flex gap={8} align={"center"}>
                  <Button
                    p={0}
                    variant="transparent"
                    onClick={() => router.push(`/category/${category.id}`)}
                  >
                    Edit Category
                  </Button>
                  <Button
                    p={0}
                    variant="transparent"
                    color="red"
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete Category
                  </Button>
                </Flex>
              </Grid.Col>
            );
          })}
          {/* END MAPPING CATEGORIES */}
        </Grid>

        {/* MAPPING CATEGORIES */}
        {/* {categories.map((category, i) => {
          return (
            <div key={category.id} className="mb-4">
              <h1 className="text-xl font-bold">
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </h1>
              <div className="flex gap-4">
                <Button
                  p={0}
                  variant="transparent"
                  onClick={() => router.push(`/category/${category.id}`)}
                >
                  Edit Category
                </Button>
                <Button
                  p={0}
                  variant="transparent"
                  color="red"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete Category
                </Button>
              </div>
            </div>
          );
        })} */}
        {/* END MAPPING CATEGORIES */}
      </section>
    </>
  );
}
