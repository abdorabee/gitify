import { db } from "@/server/db";
import {auth , clerkClient} from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const SyncUser = async () =>{
    const {userId} = await auth();
    if(!userId){
        throw new Error('User not found');
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if(!user.emailAddresses[0]?.emailAddress){
        throw new Error('Email not found');
    }
    await db.user.upsert({
        where: {
           emailAddress: user.emailAddresses[0]?.emailAddress ?? ""
        },
        create: {
            id: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
            imageUrl: user.imageUrl,
        },
        update: {
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
            imageUrl: user.imageUrl,
        },
    });
    return redirect('/dashboard');
}