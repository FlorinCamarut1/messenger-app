"use client";

import { deleteConversation } from "@/actions/deleteConversation";
import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { toast } from "../ui/use-toast";
import { FiAlertTriangle } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { Button } from "../ui/button";

import useConversation from "@/hooks/useConversation";
import Modal from "../ui/Modal";
import LoadingModal from "../ui/LoadingModal";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfirmModal = ({ isOpen, onClose }: ConfirmModalProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { conversationId } = useConversation();

  const onDelete = useCallback(() => {
    deleteConversation(conversationId).then((data) => {
      if (data?.error) {
        toast({ variant: "destructive", description: data?.error });
      } else if (data?.success) {
        toast({ description: data?.success });
        router.push("/conversations");
        router.refresh();
      }
      onClose();
    });
  }, [conversationId, router, onClose]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              Delete conversation
            </Dialog.Title>
            <div className="mt-2">
              <p>
                Are you sure you want to delete this conversation ? This action
                cannot be undone!
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button variant="destructive" disabled={isPending} onClick={onDelete}>
            Delete
          </Button>
          <Button variant="ghost" disabled={isPending} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmModal;
