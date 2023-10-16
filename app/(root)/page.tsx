import ThreadCard from "@/Components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs";

import { UserButton } from "@clerk/nextjs";
 
export default async function Home() {
  const result = await fetchPosts(1,30);
  console.log("post from DB for the home page",result)
  const user=await currentUser();
  return (
    <>
    <div className="head-text" >
      Home
    </div>
    <section className="mt-9 flex flex-col gap-10">
      {
        result.posts.length===0?(
          <p className="no-result">No Threads found</p>
        ):
          (
            <>
            {
              result.posts.map((post)=>(
                <ThreadCard 
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                />
              ))
            }
            </>
          )
      }

    </section>
    </>
  )
}