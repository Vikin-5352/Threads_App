"use client";
import { sidebarLinks } from "@/constants/index";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


function BottomBar(){
    const router = useRouter();
    const pathName = usePathname();
    console.log("bottom bar")
    // console.log("router", router);
    // console.log("pathname", pathName);
    return (
        
        <section className="bottombar">
            <div className="bottombar_container">
            {sidebarLinks.map((link) => {
          //console.log("routes", link.route);

          const isActive =
            (pathName.includes(link.route) && link.route.length > 1) ||
            pathName == link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link flex-col justify-center items-center  ${isActive && "bg-blue"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />

              <p className="text-subtle-medium text-light-1 max-sm:hidden">{link.label.split(" ")[0]}</p>
            </Link>
          );
        })}
            </div>
        </section>
    )
}

export default BottomBar;