"use client";
import { Button, Input } from "@mantine/core";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function PostCategoryComponent() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // POST CATEGORY
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    await fetch("/api/category", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: category,
      }),
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    setIsLoading(false);

    router.refresh();
  };

  return (
    <>
      <section className="p-8 flex items-end gap-2">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex items-end gap-4"
        >
          <Input.Wrapper label="New Category Name" w={380}>
            <Input
              placeholder="Insert New Category Name"
              radius={"sm"}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Input.Wrapper>
          <Button type="submit" loading={isLoading}>
            Save
          </Button>
        </form>
      </section>
    </>
  );
}
