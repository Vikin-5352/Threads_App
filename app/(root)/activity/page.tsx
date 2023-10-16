import { fetchUser, getActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  console.log("showing current user db info", userInfo);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //get notifications
  const activity = await getActivity(userInfo._id);

  console.log("activity replies", activity);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          activity.map((singleActivity) => {
            return (
              <>
                <Link
                  key={singleActivity._id}
                  href={`/thread/${singleActivity.parentId}`}
                >
                  <article className="activity-card">
                    <Image
                      src={singleActivity.author.image}
                      alt="profile image"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-blue">
                        {singleActivity.author.name}
                      </span>{" "}
                       replied to your post
                    </p>
                  </article>
                </Link>
              </>
            );
          })
        ) : (
          <p className="no-result">No activity yet</p>
        )}
      </section>
    </section>
  );
}

export default page;
