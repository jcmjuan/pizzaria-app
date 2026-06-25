"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { deleteProductAction } from "@/actions/products";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  productId: string;
}

export function DeleteButtonProduct({ productId }: DeleteButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function executeDeleteProduct() {
    setIsSubmitting(true);
    const result = await deleteProductAction(productId);
    setIsSubmitting(false);

    if (result.success) {
      setShowConfirm(false);
      router.refresh();
      return;
    }

    if (result.error !== "") {
      setError(result.error);
    }
  }

  const handleConfirm = async () => {
    setError(null);
    await executeDeleteProduct();
  };

  return (
    <>
      <Button onClick={() => setShowConfirm(true)} variant="destructive">
        <Trash className="w-5 h-5" />
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={(open) => { setShowConfirm(open); setError(null); }}>
        <AlertDialogContent className="bg-app-card text-white border-app-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-md mx-6">{error}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-app-border text-white hover:bg-transparent hover:text-white">
              Fechar
            </AlertDialogCancel>
            {!error && (
              <Button onClick={handleConfirm} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                {isSubmitting ? "Excluindo..." : "Confirmar"}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
