"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ThreadValidation } from "@/lib/validations/thread";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
// import { updateUser } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { CreateThread } from "@/lib/actions/thread.action";

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

function PostThread({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit=async (values:z.infer<typeof ThreadValidation>)=>{
    await CreateThread({
      text:values.thread,
      author:userId,
      communityId:null,
      path:pathname
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="mt-10 flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <Button type="submit" className="bg-blue">
            Post Thread
      </Button>

      </form>
    </Form>
  );
}

export default PostThread;
