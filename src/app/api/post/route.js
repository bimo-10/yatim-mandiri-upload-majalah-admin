import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import apiKeyMiddleware from "@/libs/apiKey";

// GET PRISMA
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  // REGEX SYMBOL
  let regex_symbols = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/;

  // GET SEARCH PARAMS
  const title = searchParams.get("title")
    ? searchParams.get("title").replace(regex_symbols, " ")
    : null;

  const content = searchParams.get("content")
    ? searchParams.get("content").replace(regex_symbols, " ")
    : null;

  const category = searchParams.get("category");
  const tahun = searchParams.get("tahun");
  const populer = searchParams.get("populer");

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const pageNum = +(searchParams.get("pageNum") ?? 0);
  const pageSize = +(searchParams.get("sizeNum") ?? 10);

  const search = searchParams.get("search");
  // let pages = searchParams.get("page");
  // let perPages = searchParams.get("perPage");

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

  // PAGINATION PARAMS
  // let page = 1;

  // const queries = {
  //   orderBy: {
  //     id: "desc",
  //   },
  // };

  // if (search) {
  //   Object.assign(queries, {
  //     where: {
  //       title: {
  //         contains: search,
  //         mode: "insensitive",
  //       },
  //       content: {
  //         contains: search,
  //         mode: "insensitive",
  //       },
  //       categories: {
  //         some: {
  //           name: {
  //             contains: search,
  //             mode: "insensitive",
  //           },
  //         },
  //       },
  //       populer: {
  //         contains: search,
  //         mode: "insensitive",
  //       },
  //     },
  //   });
  // }

  // if (searchParams.get("page")) {
  //   page = parseInt(searchParams.get("page"));
  // }

  // if (searchParams.get("perPage")) {
  //   Object.assign(queries, {
  //     take: parseInt(searchParams.get("perPage")),
  //     skip: page > 0 ? parseInt(searchParams.get("perPage")) * (page - 1) : 0,
  //   });
  // }

  let whereCondition = {};

  // SEARCH BERDASARKAN TITLE, CONTENT
  if (title || content) {
    whereCondition = {
      ...whereCondition,
      OR: [
        title ? { title: { contains: title, mode: "insensitive" } } : {},
        content ? { content: { contains: content, mode: "insensitive" } } : {},
      ],
    };
  }

  // SEARCH BERDASARKAN CATEGORY
  if (category) {
    whereCondition = {
      ...whereCondition,
      categories: {
        some: {
          name: {
            contains: category,
            mode: "insensitive",
          },
        },
      },
    };
  }

  // SEARCH BERDASARKAN PERTAHUN
  if (tahun) {
    whereCondition = {
      ...whereCondition,
      date: {
        gte: new Date(tahun + "-01-01"),
        lte: new Date(tahun + "-12-31"),
      },
    };
  }

  // DEFAULT SORTING
  let orderByCondition = { updatedAt: "desc" };

  // SORTING PERTAHUN
  if (tahun) {
    orderByCondition = { date: "asc" };
  }

  // SORTING BERDASARKAN POPULER
  if (populer === "true") {
    // SORTING BERDASARKAN TANGGAL
    if (startDate && endDate) {
      whereCondition = {
        ...whereCondition,
        date: {
          gte: new Date(startDate + "T00:00:00Z"),
          lte: new Date(endDate + "T23:59:59Z"),
        },
      };
    }
    orderByCondition = {
      views: {
        _count: "desc",
      },
    };
  }

  // PAGINATION
  const totalCount = await prisma.post.count({ where: whereCondition });
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = Math.min(pageNum, totalPages - 1);

  const response = await prisma.post.findMany({
    where: whereCondition,
    include: {
      categories: true,
      views: true,
    },
    orderBy: orderByCondition,
    // orderBy: {
    //   updatedAt: "desc",
    // },
    skip: pageNum * pageSize,
    take: pageSize.length,
  });

  // const totalPages = Math.ceil(totalCount / pageSize);

  // return NextResponse.json(response);
  // return NextResponse.json({ response, totalPages });

  return NextResponse.json({
    data: response,
    pagination: { totalCount, totalPages, currentPage },
  });
}

// POST PRISMA
export async function POST(request, res) {
  // const headerList = headers();
  // const isJson =
  //   headerList.get("content-type") === "application/json" ? true : false;
  // const apiKey = headerList.get("api-key");

  // let req;
  // let data;

  // if (apiKey !== process.env.API_KEY) {
  //   return NextResponse.json(
  //     {
  //       message: "Unauthorized",
  //       status: false,
  //       data: "API KEY NOT FOUND",
  //     },
  //     {
  //       status: 401,
  //     }
  //   );
  // }

  // if (isJson) {
  //   req = await request.json();
  //   data = req;
  // } else {
  //   req = await request.formData();
  //   data = Object.fromEntries(req.entries());
  // }

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
  // } catch (error) {
  //     return NextResponse.json({
  //       status: 500,
  //     })
  //   }
}
