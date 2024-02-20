"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import Avatar from "../layout/sidebar/Avatar";
import { startConversation } from "@/actions/startConversation";

interface UserBoxProps {
  data: User;
}
const UserBox = ({ data }: UserBoxProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleClick = useCallback(() => {
    startTransition(() => {
      startConversation({ userId: data.id });
      router.push(`/conversations/${data.id}`);
    });

    // axios.post('/api/conversations',{
    //   userId:data.id
    // }) to do.........................................................................
  }, [router, data.id]);

  return (
    <div
      onClick={handleClick}
      className="  relative 
      flex 
      w-full 
      cursor-pointer 
      items-center 
      space-x-3 
      rounded-lg 
      bg-white
      p-3
      transition
      hover:bg-neutral-100"
    >
      <Avatar user={data} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">{data.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
