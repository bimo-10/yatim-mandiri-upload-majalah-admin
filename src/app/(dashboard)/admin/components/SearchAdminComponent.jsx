"use client";

import { ActionIcon, Badge, Box, Flex, Text, Tooltip } from "@mantine/core";
import moment from "moment";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

import "mantine-react-table/styles.css";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { ModalsProvider, modals } from "@mantine/modals";

import { QueryClient, useQueryClient } from "@tanstack/react-query";

export default function SearchAdminComponent({ posts }) {
  const [data, setData] = useState(posts);
  const [validationErrors, setValidationErrors] = useState({});
  const router = useRouter();

  // USE MEMO

  const columns = useMemo(
    () => [
      {
        accessorKey: "image",
        id: "image",
        header: "Image",
        Cell: ({ renderedCellValue, row }) => {
          // onClick: () => router.push(`/${row.id}`);
          return (
            <Image
              alt={row.original.title}
              height={200}
              width={200}
              src={`/images/${row.original.image}`}
              className="w-44 h-36" // Provide the image URL here
            />
          );
        },
        mantineEditFileInputProps: {
          type: "file",
          require: true,
          error: validationErrors?.image,
          onFocus: () => {
            setValidationErrors({ ...validationErrors, image: undefined });
          },
        },
      },
      {
        accessorKey: "title",
        header: "Title",
        mantineEditTextInputProps: {
          type: "text",
          require: true,
          error: validationErrors?.title,
          onfocus: () => {
            setValidationErrors({ ...validationErrors, title: undefined });
          },
        },
      },
      {
        accessorKey: "content", //normal accessorKey
        header: "Content",
        Cell: ({ renderedCellValue, row }) => {
          return (
            <Box
              dangerouslySetInnerHTML={{
                __html: renderedCellValue.substring(0, 250) + "...",
              }}
              // dangerouslySetInnerHTML={{ __html: renderedCellValue }}
              style={{ whiteSpace: "pre-wrap" }}
            />
          );
        },
        mantineEditTextInputProps: {
          type: "text",
          require: true,
          error: validationErrors?.content,
          onfocus: () => {
            setValidationErrors({ ...validationErrors, content: undefined });
          },
        },
      },
      {
        accessorKey: "categories",
        header: "Categories",
        Cell: ({ renderedCellValue, row }) => {
          return (
            <>
              {renderedCellValue.map((category) => (
                <Badge key={category.id} mx={5}>
                  {category.name}
                </Badge>
              ))}
            </>
          );
        },
        mantineEditMultiSelectInputProps: {
          require: true,
          error: validationErrors?.categories,
          onfocus: () => {
            setValidationErrors({ ...validationErrors, categories: undefined });
          },
        },
      },
      {
        accessorKey: "date",
        header: "Date",
        Cell: ({ renderedCellValue, row }) => {
          return (
            <Text>
              {moment(renderedCellValue).format("dddd, Do MMMM YYYY")}
            </Text>
          );
        },
        mantineEditDateInputProps: {
          type: "date",
          require: true,
          error: validationErrors?.date,
          onfocus: () => {
            setValidationErrors({ ...validationErrors, date: undefined });
          },
        },
      },
    ],
    [validationErrors]
  );

  // HANDLE DELETE
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "DELETE",
        data: { id: id },
      });
      const data = await response.json();
      // console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
    router.refresh();
  };

  // TABLE MANTINE
  const table = useMantineReactTable({
    columns,
    data,
    enableFacetedValues: true,
    enableColumnPinning: true,
    positionToolbarAlertBanner: "bottom",
    mantinePaginationProps: {
      radius: "xl",
      size: "lg",
    },
    mantineSearchTextInputProps: {
      placeholder: "Search Employees",
    },
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: {
      id: "alertBanner",
      color: "red",
      title: "Error",
      variant: "filled",
      isDismissible: true,
    },
    // mantineTableBodyRowProps: ({ row }) => ({
    //   onClick: () => router.push(`/${row.id}`),
    //   sx: {
    //     cursor: "pointer",
    //   },
    // }),
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon onClick={() => router.push(`/update/${row.id}`)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => handleDelete(row.id)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="View">
          <ActionIcon onClick={() => router.push(`/${row.id}`)}>
            <IconEye />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
  });

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
}
