import { z } from "zod"

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "O Nome do produto e obrigatorio" }),
    price: z.string().min(1, { message: "O Valor do produto e obrigatorio" }),
    description: z.string().min(1, { message: "A Descrição do produto e obrigatoria" }),
    category_id: z.string({ message: "A Categoria do produto e obrigatoria" })
  })
})

export const listProductSchema = z.object({
  query: z.object({
    disabled: z.enum(["true", "false"], { message: "O parametro disabled deve ser 'true' ou 'false'",    
    })
    .optional()
    .default("false")
    .transform((val) => val === "true")
  })
})

export const listProductByCategorySchema = z.object({
  query: z.object({
    category_id: z.string({ message: "O category_id é obrigatório"
    })
    .min(1, { message: "O category_id é obrigatório" })
  })
})

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string({ message: "ID do produto é obrigatório" }),
  }),
  body: z.object({
    name: z.string().min(1, { message: "O Nome do produto e obrigatorio" }).optional(),
    price: z.string().min(1, { message: "O Valor do produto e obrigatorio" }).optional(),
    description: z.string().min(1, { message: "A Descrição do produto e obrigatoria" }).optional(),
    category_id: z.string({ message: "A Categoria do produto e obrigatoria" }).optional(),
  }),
})