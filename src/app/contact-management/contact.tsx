"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { DataTable } from "./table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { deleteContact, getContacts } from "@/services/ContactService";
import { Contact } from "@/types/Contact";
import { useLoading } from "@/context/LoadingContext";
import { User } from "@/types/User";

const ContactManagement: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const { setIsLoading } = useLoading();
  const router = useRouter();

  const handleEdit = (contact: Contact) => {
    router.push(`/contact-management/${contact.id}`);
  };

  const handleDelete = (contact: Contact) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (contact?.id !== undefined) {
          await deleteContact(contact.id).then(() => {
            setContacts((prevContacts) =>
              prevContacts.filter((item) => item.id !== contact.id),
            );
          });
        } else {
          toast.error("Role ID is undefined. Cannot delete the role.");
        }
        Swal.fire("Deleted!", "The role has been deleted.", "success").then(
          () => {
            router.push("/contact-management/");
          },
        );
      }
    });
  };

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      await getContacts()
        .then((response) => {
          setContacts(response.data.results);
        })
        .finally(() => setIsLoading(false));
    } catch (error) {
      console.error("Error fetching Contacts:", error);
      Swal.fire(
        "Error!",
        "Failed to fetch Contacts. Please try again.",
        "error",
      );
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <Card className="flex flex-col gap-2">
      <CardContent>
        <DataTable
          columns={columns(handleEdit, handleDelete)}
          data={contacts}
        />
      </CardContent>
    </Card>
  );
};

export default ContactManagement;
