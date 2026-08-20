import { z } from "zod";

const cpfRegex = /^\d{11}$/;
const phoneRegex = /^\+?\d{10,13}$/;

export const createFamilySchema = z.object({
  familyLabel: z.string().trim().min(2).max(120).optional(),
  zipCode: z.string().trim().min(8).max(9),
  street: z.string().trim().min(2).max(120),
  number: z.string().trim().min(1).max(15),
  complement: z.string().trim().max(120).optional(),
  neighborhood: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(120),
  state: z.string().trim().length(2),
  guardians: z
    .array(
      z.object({
        fullName: z.string().trim().min(3).max(140),
        cpf: z.string().trim().regex(cpfRegex, "CPF inválido"),
        phone: z.string().trim().regex(phoneRegex, "Telefone inválido"),
        email: z.string().trim().email().optional().or(z.literal("")),
        relationship: z.string().trim().min(2).max(80),
      }),
    )
    .min(1),
  children: z
    .array(
      z.object({
        fullName: z.string().trim().min(3).max(140),
        nickname: z.string().trim().max(120).optional(),
        birthDate: z.string().date(),
        sex: z.enum(["MALE", "FEMALE", "OTHER", "NOT_INFORMED"]),
        school: z.string().trim().max(140).optional(),
        schoolGrade: z.string().trim().max(60).optional(),
        unitClass: z.string().trim().max(60).optional(),
        allergies: z.string().trim().max(400).optional(),
        foodRestriction: z.string().trim().max(400).optional(),
        continuousMedication: z.boolean(),
        medicationDetails: z.string().trim().max(400).optional(),
        hasHealthCondition: z.boolean(),
        healthConditionDetails: z.string().trim().max(400).optional(),
        specialAttentionNeeds: z.string().trim().max(400).optional(),
        generalNotes: z.string().trim().max(600).optional(),
        shirtSize: z.enum(["PP", "P", "M", "G"]).optional(),
        eventDiscoveryChannel: z.string().trim().max(80).optional(),
        imageConsent: z.enum(["GRANTED", "DENIED"]),
        lgpdConsent: z.boolean().refine((v) => v, "Aceite LGPD obrigatório"),
        interests: z.array(z.string().trim().min(2).max(60)).optional(),
      }),
    )
    .min(1),
  emergencyContacts: z
    .array(
      z.object({
        fullName: z.string().trim().min(3).max(140),
        phone: z.string().trim().regex(phoneRegex, "Telefone inválido"),
      }),
    )
    .min(1),
  authorizedPickups: z.array(
    z.object({
      fullName: z.string().trim().min(3).max(140),
      document: z.string().trim().max(30).optional(),
      phone: z.string().trim().regex(phoneRegex, "Telefone inválido").optional().or(z.literal("")),
    }),
  ),
});

export const checkInSchema = z.object({
  childId: z.string().cuid(),
});
