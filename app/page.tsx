import Appbar from "@/components/appbar";
import CreatePost from "@/components/Post/createPost";
import PostFormat from "@/components/Post/postFormat";
import Sidebar from "@/components/sidebar";
import Image from "next/image";

export default function Home() {
  return (
    <div className='w-[95%] sm:w-[60%] m-auto p-4'>
      <CreatePost />
      <PostFormat />
    </div>
  );
}
