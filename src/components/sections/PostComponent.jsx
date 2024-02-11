"use client";

import {
  Button,
  FileInput,
  Grid,
  MultiSelect,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegFilePdf, FaRegImage } from "react-icons/fa6";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function PostComponent({ categories }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // console.log(categories);

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      tanggal: "",
      categoryId: [],
      coverImage: "",
      pdf: "",
    },
    validate: {
      title: isNotEmpty("Masukkan judul"),
      content: isNotEmpty("Masukkan konten"),
      tanggal: isNotEmpty("Masukkan tanggal"),
      categoryId: isNotEmpty("Masukkan categoryId"),
      coverImage: isNotEmpty("Masukkan gambar cover"),
      pdf: isNotEmpty("Masukkan file PDF"),
    },
    transformValues: (values) => ({
      ...values,
      tanggal: new Date(values.tanggal).toISOString(),
    }),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("tanggal", values.tanggal);
    formData.append("categoryId", values.categoryId);
    formData.append("coverImage", values.coverImage);
    formData.append("pdf", values.pdf);

    const response = await fetch("/api/post", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log(data);

    setIsLoading(false);

    router.refresh();
    router.push("/admin");
  };

  return (
    <div>
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
        className="p-4"
      >
        <Grid>
          <Grid.Col span={6}>
            <DateInput
              valueFormat="DD/MM/YYYY"
              label="Release Date"
              placeholder="DD/MM/YYYY"
              {...form.getInputProps("tanggal")}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <TextInput
              label="Title"
              placeholder="Your Title"
              withAsterisk
              {...form.getInputProps("title")}
            />
          </Grid.Col>
        </Grid>

        <Grid justify="center" my={12}>
          {/* MULTISELECT POST */}
          <Grid.Col span={4}>
            <MultiSelect
              label="Kategori Majalah"
              placeholder="Pilih Kategori"
              data={categories.map((item) => {
                return {
                  value: item.id.toString(),
                  label: item?.name,
                };
              })}
              {...form.getInputProps("categoryId")}
            />
            {/* <Select
              label="Kategori Majalah"
              placeholder="Pilih Kategori"
              data={categories.map((item) => {
                return {
                  value: item.id.toString(),
                  label: item?.name,
                };
              })}
              {...form.getInputProps("categoryId")}
            /> */}
          </Grid.Col>

          {/* COVER IMAGE POST */}
          <Grid.Col span={4}>
            <FileInput
              rightSection={<FaRegImage />}
              label="Image File"
              placeholder="Upload Image"
              accept="image/png, image/jpeg"
              {...form.getInputProps("coverImage")}
            />
          </Grid.Col>

          {/* PDF POST */}
          <Grid.Col span={4}>
            <FileInput
              rightSection={<FaRegFilePdf />}
              label="PDF File"
              placeholder="Upload Magazine .pdf File"
              accept="application/pdf"
              {...form.getInputProps("pdf")}
            />
          </Grid.Col>
        </Grid>

        <ReactQuill
          theme="snow"
          value={form.values.content}
          {...form.getInputProps("content")}
        />
        <Button
          className="mt-5"
          type="submit"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
        >
          Post
        </Button>
      </form>
    </div>
  );
}
