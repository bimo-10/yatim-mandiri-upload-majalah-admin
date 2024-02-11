export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/admin",
    "/admin",
    "/post",
    "/update",
    "/",
    "/category",
  ],
};
