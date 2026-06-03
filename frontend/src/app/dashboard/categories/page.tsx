import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Category } from "@/lib/types";
import { Tags } from "lucide-react";
import { CategoryForm } from "@/components/dashboard/category-form";
import { DeleteCategoryButton } from "@/components/dashboard/delete-category-button";

export default async function Categories() {
  const token = await getToken();
  const categories = await apiClient<Category[]>("/category", {
    token: token!,
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Categorias
          </h1>
          <p className="text-sm sm:text-base mt-1">Organize suas categorias</p>
        </div>

        <CategoryForm />
      </div>

      {categories.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="bg-app-card border-app-border transition-shadow hover:shadow-md text-white"
            >
              <CardHeader>
                <CardTitle className="gap-2 flex items-center justify-between text-base md:text-lg">
                  <div className="flex items-center gap-2">
                    <Tags className="w-5 h-5" />
                    <span>{category.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <CategoryForm category={category}>
                      <button className="p-2 rounded-md hover:bg-gray-600 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-300"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                          <path d="m15 5 4 4" />
                        </svg>
                      </button>
                    </CategoryForm>
                    <DeleteCategoryButton categoryId={category.id} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 text-sm">{category.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
