import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

// GET PRISMA
export async function GET(req, context) {
  const id = Number(context.params.id);

  const response = await prisma.post.findFirst({
    where: {
      id: id,
    },
    include: {
      categories: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 10,
  });

  if (!response) {
    return NextResponse.json({ message: "id not found" }, { status: 500 });
  }

  return NextResponse.json(response);
}

// DELETE PRISMA
export async function DELETE(req, { params }) {
  const { id } = params;

  const checkData = await prisma.post.findFirst({
    where: {
      id: Number(id),
    },
  });

  if (!checkData) {
    return NextResponse.json({ message: "id not found" }, { status: 500 });
  }

  const response = await prisma.post.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json(response);
}

// PUT PRISMA
export async function PUT(req, context) {
  const data = await req.formData();
  const coverImage = data.get("coverImage");
  const filePdf = data.get("pdf");

  const id = Number(context.params.id);

  if (!id) {
    return NextResponse.json({ message: "id not found" }, { status: 500 });
  }

  if (!coverImage) {
    return NextResponse.json(
      { message: "file coverImage not found" },
      { status: 500 }
    );
  }

  if (!filePdf) {
    return NextResponse.json(
      { message: "file filePdf not found" },
      { status: 500 }
    );
  }

  const bytesCover = await coverImage.arrayBuffer();
  const bufferCover = Buffer.from(bytesCover);

  const bytesPdf = await filePdf.arrayBuffer();
  const bufferPdf = Buffer.from(bytesPdf);

  await writeFile(
    path.join(process.cwd(), `./public/images/${coverImage.name}`),
    bufferCover
  );

  await writeFile(
    path.join(process.cwd(), `./public/pdf/${filePdf.name}`),
    bufferPdf
  );

  const response = await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      title: data.get("title"),
      content: data.get("content"),
      date: data.get("tanggal"),
      categories: {
        connect: data
          .getAll("categoryId")[0]
          .replaceAll(" ", "")
          .split(",")
          .map((it) => {
            return {
              id: Number(it),
            };
          }),
      },
      image: coverImage.name,
      pdf: filePdf.name,

      // viewCount: {
      //   increment: 1,
      // },
    },
  });

  return NextResponse.json({
    status: 201,
    message: "Update Successfully",
    data: response,
  });
}
