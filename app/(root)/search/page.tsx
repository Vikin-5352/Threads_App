import ProfileHeader from "@/Components/shared/ProfileHeader";

import {
  fetchUser,
  fetchUserPosts,
  fetchUsers,
} from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/Components/shared/ThreadsTab";
import UserCard from "@/Components/cards/UserCard";
async function page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  console.log("showing current user db info", userInfo);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //fetch user

  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });
  console.log("search user list", result.users.map((person)=>console.log("person")));

  return (
    <section>
      <h1 className="head-text mb-10">
        Search
        <div className="mt-14 flex flex-col gap-9">
          {result.users.length === 0 ? (
            <div className="no-result"> No Users</div>
          ) : (
            <>
              {result.users.map((person) => {
            return (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
                  />)
              })}
            </>
          )}
        </div>
      </h1>
    </section>
  );
}

export default page;
