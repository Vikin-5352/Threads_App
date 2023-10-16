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
import { CommentValidation } from "@/lib/validations/thread";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
// import { updateUser } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.action";
// import { CreateThread } from "@/lib/actions/thread.action";

interface props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}
const Comment = ({ threadId, currentUserImg, currentUserId }: props) => {
  const pathname = usePathname();
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: ""
    },
  });

  const test=()=>console.log("test click")

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    console.log("inside the submit of comment");

    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    );
    console.log("inside the submit of comment before reset");

    form.reset();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex w-full items-center gap-3">
                <FormLabel>
                  <Image
                    src={currentUserImg}
                    alt="Profile Image"
                    width={48}
                    height={48}
                    className="rounded-full object-fill"
                  />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    placeholder="Comment.."
                    className="no-focus text-light-1 outline-none bg-dark-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit" onClick={test} className="comment-form_btn">
            Reply
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Comment;
