import CreatePost from "@/components/Post/createPost";
import PostFormat from "@/components/Post/postFormat";

export default function Home() {
  return (
    <div className='w-[95%] sm:w-[60%] m-auto p-4'>
      <CreatePost />
      <PostFormat />
    </div>
  );
}
