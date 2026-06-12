import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    table: z
      .number({ message: "O número da mesa é obrigatório" })
      .int({ message: "O número da mesa deve ser um número inteiro" })
      .positive({ message: "O número da mesa deve ser um número positivo" }),
    name: z.string().optional(),
  }),
});

export const addItemSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: "Order deve ser uma string" })
      .min(1, "A order_id deve ser obrigatoria"),
    product_id: z
      .string({ message: "O produto deve ser uma string" })
      .min(1, "O id do produto deve ser obrigatoria"),
    amount: z
      .number()
      .int("Quantidade deve ser um numero inteiro")
      .positive("Quantidade deve ser um numero positivo"),
  }),
});

export const removeItemSchema = z.object({
  query: z.object({
    item_id: z
      .string({ message: "O item_id deve ser uma string" })
      .min(1, "O item_id é obrigatório"),
  }),
});

export const detailOrderSchema = z.object({
  query: z.object({
    order_id: z
      .string({ message: "A order_id deve ser uma string" })
      .min(1, "A order_id é obrigatória"),
  }),
});

export const sendOrderSchema = z.object({
  body: z.object({
    order_id: z.string({ message: "ID do pedido precisa ser uma string"}),
    name: z.string({ message: "O nome precisa ser um texto"})
  })
})

export const finishOrderSchema = z.object({
  body: z.object({
    order_id: z.string({ message: "ID do pedido precisa ser uma string"}),
  })
})

export const closeOrderSchema = z.object({
  body: z.object({
    order_id: z.string({ message: "ID do pedido precisa ser uma string"}),
  })
})

export const deleteOrderSchema = z.object({
  query: z.object({
    order_id: z.string({ message: "ID do pedido precisa ser uma string"}),
  })
})

export const updateItemSchema = z.object({
  body: z.object({
    item_id: z.string({ message: "ID do item precisa ser uma string" }),
    amount: z
      .number({ message: "Quantidade precisa ser um número" })
      .int({ message: "Quantidade precisa ser um número inteiro" }),
  }),
})

export const startOrderSchema = z.object({
  body: z.object({
    order_id: z.string({ message: "ID do pedido precisa ser uma string"}),
    item_ids: z.array(z.string()).optional(),
  })
})

export const serveOrderSchema = z.object({
  body: z.object({
    order_id: z.string({ message: "ID do pedido precisa ser uma string"}),
    item_ids: z.array(z.string()).optional(),
  })
})

export const activeOrderSchema = z.object({
  query: z.object({
    table: z.string({ message: "O número da mesa é obrigatório" }),
  }),
})
