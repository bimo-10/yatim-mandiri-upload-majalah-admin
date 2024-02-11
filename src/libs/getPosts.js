export default async function getPosts() {
  const response = await fetch(`${process.env.BASE_URL}/api/post`, {
    cache: "no-store",
  });
  const data = await response.json();

  return data;
}
