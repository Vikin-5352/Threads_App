"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface Props {
  user: {
    id: string;
    name: string;
    objectId: string;
    userName: string;
    bio: string;
    image: string;
    path: string;
  };
  btnTitle: String;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  console.log("user values passed from onboarding to account profile",user);

  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.userName || "",
      bio: user?.bio || "",
    },
  });

  

  const onSubmit=async (values: z.infer<typeof UserValidation>) =>{
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    //e.preventDefault();
    const blob = values.profile_photo;
    console.log("profile photo value", blob);

    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);
      console.log("uploadthing result ", imgRes);
      if (imgRes && imgRes[0].url) {
        values.profile_photo = imgRes[0].url;
      }
    }
    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname,
    });
    if (pathname == "/profile/edit"){ router.back();}
    else{ router.push("/");}
  }

  const handleImage=(
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  )=> {
    e.preventDefault();
    console.log(fieldChange);
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log("files from the user", e.target.files);
      setFiles(Array.from(e.target.files));
      console.log(Array.from(e.target.files));
      console.log("file type", file.type);
      if (!file.type.includes("image")) return;
      console.log("pass if condition");

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        console.log("file on load");
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  }



  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_photo"
                    priority
                    width={96}
                    height={96}
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile_photo"
                    width={24}
                    height={24}
                    className="rounded-full object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => {
                    handleImage(e, field.onChange);
                  }}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-blue hover:bg-[#1da0f2d0]">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
