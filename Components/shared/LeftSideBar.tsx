"use client";
import { sidebarLinks } from "@/constants/index";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OrganizationSwitcher, SignOutButton, SignedIn, SignedOut,useAuth } from "@clerk/nextjs";



function LeftSideBar() {
  const router = useRouter();
  const pathName = usePathname();
  const {userId}=useAuth();
  console.log("leftSidebar")
  // console.log("router", router);
  // console.log("pathname", pathName);


  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col px-5">


        {sidebarLinks.map((link) => {
         // console.log("routes", link.route);

          const isActive =
            (pathName.includes(link.route) && link.route.length > 1) ||
            pathName == link.route;

            if(link.route==="/profile") link.route=`${link.route}/${userId}`
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link items-center ${isActive && "bg-blue"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />

              <p className="text-light-1 text-small-medium max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
      <SignedIn>
                    <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                        <div className="flex cursor-pointer items-center p-4 gap-4">
                            <Image src={"/assets/logout.svg"} alt="logOut" width={24} height={24}/>
                            <p className="text-light-1 text-small-medium max-lg:hidden">Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
      </div>
    </section>
  );
}

export default LeftSideBar;
