import { getPosts } from "./actions";
import BlogClient from "./BlogClient";

export const metadata = {
  title: "Blog",
};

export default async function BlogPage() {
  const initialPosts = await getPosts();

  return <BlogClient initialPosts={initialPosts} />;
}
