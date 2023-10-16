"use server";

import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { spec } from "node:test/reporters";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface params {
  userId: string;
  username: string;
  bio: string;
  name: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  bio,
  name,
  image,
  path,
}: params): Promise<void> {
  connectToDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (err) {
    throw new Error(`failed to update the user ${err}`);
  }
}

export async function fetchUser(userId: String) {
  try {
    connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path:"communites",
    //   model:Community
    // })
  } catch (err: any) {
    throw new Error(`failed to fetch the user ${err.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();
    //find all the user by the id
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });

    return threads;
  } catch (err: any) {
    throw new Error(
      `there is a error in fetcting the threads for the profile: ${err.message}`
    );
  }
}

export async function   fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortby = "desc",
}:{
  userId:string;
  searchString?:string;
  pageNumber?:number;
  pageSize?:number;
  sortby?:SortOrder
}) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query:FilterQuery<typeof User>={
      id:{$ne:userId}
    }
    if(searchString.trim()!==""){
      query.$or=[
        {username:{$regex:regex}},
        {name:{$regex:regex}},

      ]
    }

    const sortOptions={createdAt:sortby};
    const usersQuery=User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize)

    const totalUserCount = await User.countDocuments(query)

     const users=await usersQuery.exec();

     const isNext=totalUserCount > skipAmount+ users.length;

     return {users,isNext};

  } catch (err: any) {
    throw new Error(
      `there is error in fetcthing the user for search ${err.message}`
    );
  }
}

export async function getActivity(userId:string) {
  try {
    connectToDB();

    //find all the threads by the user
    const userThreads=await Thread.find({author:userId});

    //collect all the child thread id (replies) from the children

    const childThreadIds=userThreads.reduce((acc,userThread)=>{
      return acc.concat(userThread.children)
    },[])

    const replies = await Thread.find({
      _id:{$in:childThreadIds},
      author:{$ne:userId}
    }).populate({
      path:"author",
      model:User,
      select:"name image _id"
    })

    return replies;

  } catch (err: any) {
    throw new Error(
      `there is error in fetcthing the user for activity ${err.message}`
    );
  }
}