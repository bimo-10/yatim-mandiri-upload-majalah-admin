import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

// GET PRISMA
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const pageNum = +(searchParams.get("pageNum") ?? 0);
  const pageSize = +(searchParams.get("sizeNum") ?? 10);
  // const session = await prisma.session.findUnique({
  //   where: {
  //     sessionToken: req.cookies["next-auth.session-token"],
  //   },
  //   include: {
  //     user: true,
  //   }
  // })

  // if (!session) {
  //   return NextResponse.json(
  //     { message: "session not found" },
  //     { status: 500 }
  //   );
  // }

  const response = await prisma.post.findMany({
    include: {
      categories: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    skip: pageNum * pageSize,
    take: pageSize,
  });

  return NextResponse.json(response);
}

// POST PRISMA
export async function POST(request) {
  const data = await request.formData();
  const coverImage = data.get("coverImage");
  const filePdf = data.get("pdf");

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

  const response = await prisma.post.create({
    data: {
      title: data.get("title"),
      content: data.get("content"),
      date: data.get("tanggal"),
      categories: {
        // connect: categories.map((category) => ({ id: category.id })),
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
    },
  });

  return NextResponse.json({
    status: 201,
    message: "Insert Successfully",
    data: response,
  });
}
