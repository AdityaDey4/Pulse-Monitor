"use server";

import { auth } from "@/lib/auth";

import {
  createEmailRecipient,
  updateEmailRecipient,
  deleteEmailRecipient,
  getAllEmailRecipients,
  getEmailRecipientById,
} from "@/services/email-recipient.service";

import {
  CreateEmailRecipientInput,
  UpdateEmailRecipientInput,
  CreateEmailRecipientSchema,
  UpdateEmailRecipientSchema,
} from "@/validations/email-recipient.validation";

import { AppResponseWrapper, createErrorResponse } from "@/types/common.type";

import { EmailRecipient } from "../../generated/prisma/client";
import { EmailRecipientType } from "@/types/email-recipient.type";

export async function createEmailRecipientAction(
  data: CreateEmailRecipientInput,
): Promise<AppResponseWrapper<EmailRecipient>> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse("Unauthorized");
  }

  const parsed = CreateEmailRecipientSchema.safeParse(data);

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ?? "Validation failed",
    );
  }

  return createEmailRecipient(Number(session.user.id), parsed.data);
}

export async function updateEmailRecipientAction(
  data: UpdateEmailRecipientInput,
): Promise<AppResponseWrapper<EmailRecipient>> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse("Unauthorized");
  }

  const parsed = UpdateEmailRecipientSchema.safeParse(data);

  if (!parsed.success) {
    return createErrorResponse(
      parsed.error.issues[0]?.message ?? "Validation failed",
    );
  }

  return updateEmailRecipient(Number(session.user.id), parsed.data);
}

export async function deleteEmailRecipientAction(
  recipientId: number,
): Promise<AppResponseWrapper> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse("Unauthorized");
  }

  return deleteEmailRecipient(Number(session.user.id), recipientId);
}

export async function getAllEmailRecipientsAction(): Promise<
  AppResponseWrapper<EmailRecipientType[]>
> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse("Unauthorized");
  }

  return getAllEmailRecipients(Number(session.user.id));
}

export async function getEmailRecipientByIdAction(
  recipientId: number,
): Promise<AppResponseWrapper<EmailRecipient>> {
  const session = await auth();

  if (!session?.user?.id) {
    return createErrorResponse("Unauthorized");
  }

  return getEmailRecipientById(Number(session.user.id), recipientId);
}
