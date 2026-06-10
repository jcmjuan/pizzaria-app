"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createCategoryAction, updateCategoryAction } from "@/actions/categories";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/types";

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const isEditing = !!category;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const result = isEditing
      ? await updateCategoryAction(category!.id, formData)
      : await createCategoryAction(formData);

    if (result.success) {
      setOpen(false);
      router.refresh();
      return;
    } else {
      console.log(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <button className="p-2 rounded-md hover:bg-gray-600 transition-colors">
            <Pencil className="w-4 h-4 text-gray-300" />
          </button>
        ) : (
          <Button className="bg-brand-primary hover:bg-brand-primary font-semibold">
            <Plus className="h-5 w-5 mr-2" />
            Nova categoria
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="p-6 bg-app-card text-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar categoria" : "Criar nova categoria"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Editando categoria..."
              : "Criando nova categoria..."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="category" className="mb-2">
              Nome da categoria
            </Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={category?.name || ""}
              placeholder="Digite o nome da categoria..."
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-primary text-white hover:bg-brand-primary"
          >
            {isEditing ? "Salvar" : "Criar categoria"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
