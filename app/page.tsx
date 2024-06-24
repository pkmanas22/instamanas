
import AllPosts from "@/components/Post/allPosts";
import CreatePost from "@/components/Post/createPost";

export default function Home() {
  return (
    <div className='w-[95%] sm:w-[60%] m-auto p-4'>
      <CreatePost />
      <AllPosts />
    </div>
  );
}
