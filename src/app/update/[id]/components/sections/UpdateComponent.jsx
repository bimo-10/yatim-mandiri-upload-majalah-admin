"use client";

import {
  Button,
  FileInput,
  Flex,
  Grid,
  Image,
  MultiSelect,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { FaRegFilePdf, FaRegImage } from "react-icons/fa6";
import { DateInput } from "@mantine/dates";

import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
import { isNotEmpty, useForm } from "@mantine/form";
import moment from "moment";
import { useClickOutside, useFocusTrap, useMergedRef } from "@mantine/hooks";

export default function UpdateComponent({ posts, categories, id, post }) {
  // console.log(posts);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleUpdate = async (values) => {
    // console.log(values);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("tanggal", values.tanggal);
    formData.append("categoryId", String(values.categoryId));
    formData.append("coverImage", values.coverImage);
    formData.append("pdf", values.pdf);

    const response = await fetch(`/api/post/${id}`, {
      method: "PUT",
      body: formData,
    });
    console.log(response);

    const data = await response.json();

    console.log(data);

    setIsLoading(false);

    router.refresh();

    router.push("/admin");
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await fetch(`/api/post/${id}`);
    const data = await res.json();

    console.log(data);

    if (!data) {
      router.push("/404");
      return;
    }

    // RESET FORM
    form.setInitialValues({
      values: {
        title: data.title,
        content: data.content,
        tanggal: new Date(data.date),
        categoryId: data.categories.map((category) => category.id.toString()),
        coverImage: data.coverImage,
        pdf: data.pdf,
      },
    });

    // SET FORM
    form.setValues({
      title: data.title,
      content: data.content,
      tanggal: new Date(data.date),
      categoryId: data.categories.map((category) => category.id.toString()),
      coverImage: new File([null], data.image),
      pdf: new File([null], data.pdf),
    });

    // console.log(data);
  };

  const datas = form.values;
  console.log(datas);

  const category = String(datas.categoryId);
  // console.log(category);

  return (
    <>
      <div className="py-8">
        <form
          onSubmit={form.onSubmit((values) => handleUpdate(values))}
          className="px-4"
        >
          <Grid justify="center">
            <Grid.Col span={6}>
              {/* TANGGAL */}
              <DateInput
                // w={720}
                valueFormat="DD/MM/YYYY"
                label="Release Date"
                placeholder="DD/MM/YYYY"
                {...form.getInputProps("tanggal")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              {/* TITLE */}
              <TextInput
                label="Title"
                placeholder="Your Title"
                withAsterisk
                // w={720}
                // mt="md"
                {...form.getInputProps("title")}
              />
            </Grid.Col>
          </Grid>

          <Grid justify="center" my={12}>
            <Grid.Col span={4}>
              {/* KATEGORI SELECT */}
              <MultiSelect
                label="Kategori Majalah"
                placeholder="Pilih Kategori"
                data={categories.map((category) => {
                  return {
                    value: category.id.toString(),
                    label: category?.name.toString(),
                  };
                })}
                checkIconPosition="right"
                {...form.getInputProps("categoryId")}
              />
              {/* <Select
                label="Kategori Majalah"
                placeholder="Pilih Kategori"
                data={categories.map((item) => {
                  console.log(item);
                  return {
                    value: item.id.toString(),
                    label: item?.name,
                  };
                })}
                checkIconPosition="right"
                {...form.getInputProps("categoryId")}
              /> */}
            </Grid.Col>

            <Grid.Col span={4}>
              {/* COVER IMAGE */}
              <FileInput
                rightSection={<FaRegImage />}
                label="Image File"
                placeholder="Upload Image"
                accept="image/png, image/jpeg"
                {...form.getInputProps("coverImage")}
              />
            </Grid.Col>

            <Grid.Col span={4}>
              {/* PDF FILE */}
              <FileInput
                rightSection={<FaRegFilePdf />}
                label="PDF File"
                placeholder="Upload Magazine"
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

          <Grid my={12}>
            <Grid.Col span={4}>
              <Flex direction={"column"}>
                <Image
                  src={`/images/${datas.coverImage.name}`}
                  alt={datas.coverImage.name}
                  h={200}
                  w={200}
                />
                <Text ml={4}>{datas.coverImage.name}</Text>
              </Flex>
            </Grid.Col>

            {/* <Grid.Col span={4}>
              <Text>{datas.pdf.name}</Text>
            </Grid.Col> */}
          </Grid>
          <Button
            className="mt-5"
            theme="snow"
            type="submit"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            Update
          </Button>
        </form>
      </div>
    </>
  );
}
