import AccountProfile from "@/Components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

async function Page() {
  console.log("inside onboarding the user data will printed in terminal fetching from google or github");
  const user = await currentUser();
  const userInfo = {};
  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    userName: userInfo?.username || user?.username||"",
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user.imageUrl,
  };
  return (
    <main className=" flex mx-auto max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete now to create your profile
      </p>
      <section className="mt-9 bg-dark-2 p-10 rounded-lg">
        <AccountProfile user={userData} btnTitle="Continue" />{" "}
      </section>
    </main>
  );
}

export default Page;
