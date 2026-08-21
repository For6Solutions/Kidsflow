import { z } from "zod";

const phoneRegex = /^\+?\d{10,13}$/;

export const createFamilySchema = z.object({
  existingFamilyId: z.string().cuid().optional(),
  existingGuardianId: z.string().cuid().optional(),
  zipCode: z.string().trim().min(8).max(9),
  street: z.string().trim().min(2).max(120),
  number: z.string().trim().min(1).max(15),
  neighborhood: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  state: z.string().trim().length(2),
  child: z.object({
    fullName: z.string().trim().min(3).max(140),
    birthDate: z.string().date(),
  }),
  guardian: z.object({
    fullName: z.string().trim().min(3).max(140),
    relationship: z.string().trim().min(2).max(80),
    phone: z.string().trim().regex(phoneRegex, "Telefone inválido"),
  }),
});

export const checkInSchema = z.object({
  childId: z.string().cuid(),
});
