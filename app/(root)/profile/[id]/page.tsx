import ProfileHeader from "@/Components/shared/ProfileHeader";
import { TabsList } from "@/Components/ui/tabs";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/Components/shared/ThreadsTab";
async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  console.log("showing current user db info", userInfo);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section className="text-white">
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tabs) => {
              return (
                <TabsTrigger
                  key={tabs.label}
                  value={tabs.value}
                  className="tab"
                >
                  <Image
                    src={tabs.icon}
                    alt={tabs.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <p className="max-sm:hidden">{tabs.label}</p>
                  {tabs.label === "Threads" && (
                    <p className="ml-1 rounded-full bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {userInfo?.threads?.length}
                      {console.log("thread length", userInfo)}
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {profileTabs.map((tab) => {
            return (
              <>
                <TabsContent
                  key={`content-${tab.label}`}
                  value={tab.value}
                  className="w-full text-light-1"
                />
              </>
            );
          })}
          <ThreadsTab
            currentUserId={user.id}
            accountId={userInfo.id}
            accountType="User"
          />
        </Tabs>
      </div>
    </section>
  );
}

export default Page;
