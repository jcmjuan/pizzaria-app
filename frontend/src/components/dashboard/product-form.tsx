"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProductAction, updateProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";
import { Category, Product } from "@/lib/types";
import Image from "next/image";
import { Upload } from "lucide-react";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
  children?: React.ReactNode;
}

export function ProductForm({ categories, product, children }: ProductFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(product?.category_id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [priceValue, setPriceValue] = useState(
    product
      ? (product.price / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : ""
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const isEditing = !!product;

  function convertBRLToCents(value: string): number {
    const cleanValue = value
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    const reais = parseFloat(cleanValue) || 0;

    return Math.round(reais * 100);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    const formElement = e.currentTarget;

    if (isEditing) {
      formData.append("id", product!.id);
    }

    const name = (formElement.elements.namedItem("name") as HTMLInputElement)?.value;
    const description = (formElement.elements.namedItem("description") as HTMLInputElement)?.value;
    const priceInCents = convertBRLToCents(priceValue);

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", priceInCents.toString());
    formData.append("category_id", selectedCategory);

    if (imageFile) {
      formData.append("file", imageFile);
    }

    const result = isEditing
      ? await updateProductAction(formData)
      : await createProductAction(formData);

    setIsLoading(false);

    if (result.success) {
      setOpen(false);
      setSelectedCategory("");
      setPriceValue("");
      setImagePreview(null);
      setImageFile(null);
      router.refresh();
      return;
    } else {
      console.log(result.error);
      alert(result.error);
    }
  }

  function formatToBrl(value: string) {
    const numbers = value.replace(/\D/g, "");
    if (!numbers) return "";
    const amount = parseInt(numbers) / 100;
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatToBrl(e.target.value);
    setPriceValue(formatted);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError("A imagem deve ter no máximo 5MB.");
        return;
      }
      setImageError(null);
      setImageFile(file);
      setIsChangingImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleChangeImage() {
    setIsChangingImage(true);
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className="bg-brand-primary hover:bg-brand-primary font-semibold">
            <Plus className="h-5 w-5 mr-2" />
            Novo produto
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="p-6 bg-app-card text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar produto" : "Criar novo produto"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Editando produto..." : "Criando novo produto..."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name" className="mb-2">
              Nome do produto
            </Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={product?.name || ""}
              placeholder="Digite o nome do produto..."
              className="border-app-border bg-app-background text-white"
            />
          </div>

          <div>
            <Label htmlFor="price" className="mb-2">
              Preço
            </Label>
            <Input
              id="price"
              name="price"
              required
              placeholder="Ex: 35,00"
              className="border-app-border bg-app-background text-white"
              value={priceValue}
              onChange={handlePriceChange}
            />
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              required
              defaultValue={product?.description || ""}
              placeholder="Digite a descrição do produto..."
              className="border-app-border bg-app-background text-white min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="category" className="mb-2">
              Categoria
            </Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              required
            >
              <SelectTrigger className="border-app-border bg-app-background text-white">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-app-card border-app-border">
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="text-white hover:bg-transparent cursor-pointer"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="mb-2">Imagem do produto</Label>
            {imageError && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">{imageError}</p>
            )}
            {(imagePreview || (isEditing && product?.banner && !isChangingImage)) ? (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <Image
                  src={imagePreview || product!.banner}
                  alt="preview da imagem"
                  fill
                  className="object-cover z-10"
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={imagePreview ? clearImage : handleChangeImage}
                  className="absolute top-2 right-2 z-20"
                >
                  {imagePreview ? "Excluir" : "Alterar"}
                </Button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center transition-colors hover:bg-gray-800/30 cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-200">
                  Clique para selecionar uma imagem
                </span>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !selectedCategory}
            className="w-full bg-brand-primary text-white hover:bg-brand-primary disabled:opacity-50"
          >
            {isLoading
              ? "Salvando..."
              : isEditing
              ? "Salvar produto"
              : "Criar produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
