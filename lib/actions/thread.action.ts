"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { Children } from "react";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function CreateThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  connectToDB();
  const createdThread = await Thread.create({
    text,
    author,
    community: null,
  });

  //update user model
  await User.findByIdAndUpdate(author, {
    $push: { threads: createdThread._id },
  });

  revalidatePath(path);
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();
  //calculate the number of post to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  //fetch the post that have no parents (top level threads)
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });
    const totalPostsCount = await Thread.countDocuments({
        parentId: { $in: [null, undefined] }
      });

      const posts = await postsQuery.exec();

      const isNext = totalPostsCount > skipAmount + posts.length;
    
      return { posts, isNext };
}

export async function fetchThreadById(threadId:string){
    connectToDB();
    try{
      //Populate the community
      const thread=await Thread.findById(threadId)
      .populate({
        path:"author",
        model:User,
        select:"_id id name image"
      })
      .populate({
        path:"children",
        populate:[
          {
            path:"author",
            model:User,
            select:"_id id name parentId image"
          },
          {
            path:"children",
            model:Thread,
            populate:{
              path:'author',
              model:User,
              select:"_id id name parentId image"
            }
          }
        ]
      }).exec();
      return thread;
    }
    catch(err){
        console.log("error in the fetch threadbyId",err)
    }
}

export async function addCommentToThread(
  threadId:string,
  commentText:string,
  userId:string,
  path:string
){
  connectToDB();
  try{
    //adding the comment
    const originalThread =await Thread.findById(threadId);

    if(!originalThread){
      throw new Error("Thread not found");
    }

    // creata a new thread with the comment thread 
    const commentThread= new Thread({
      text:commentText,
      author:userId,
      parentId:threadId
    })

    //save the new thread
    const savedCommentThread=await commentThread.save();

    //update the original thread to include the new comment 
    originalThread.children.push(savedCommentThread._id);

    //save the original thread
    await originalThread.save();
    
    revalidatePath(path);

  }
  catch(err:any){
    throw new Error(`Error in addind the comment to thread: ${err.message}`)
  }
}


