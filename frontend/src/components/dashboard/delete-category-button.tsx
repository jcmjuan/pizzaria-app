"use client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { deleteCategoryAction } from "@/actions/categories";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteCategoryButtonProps {
  categoryId: string;
}

export function DeleteCategoryButton({ categoryId }: DeleteCategoryButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDeleteCategory() {
    setLoading(true);
    const result = await deleteCategoryAction(categoryId);
    setLoading(false);

    if (result.success) {
      router.refresh();
      return;
    }

    if (result.error !== "") {
      alert(result.error);
    }
  }

  return (
    <Button
      onClick={handleDeleteCategory}
      variant="destructive"
      disabled={loading}
      size="sm"
    >
      <Trash className="w-4 h-4" />
    </Button>
  );
}
