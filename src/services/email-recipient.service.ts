import { prisma } from "@/lib/prisma";

import {
  createErrorResponse,
  createSuccessResponse,
  AppResponseWrapper,
} from "@/types/common.type";

import {
  CreateEmailRecipientInput,
  UpdateEmailRecipientInput,
} from "@/validations/email-recipient.validation";

import { EmailRecipient } from "../../generated/prisma/client";
import { EmailRecipientType } from "@/types/email-recipient.type";

export async function createEmailRecipient(
  userId: number,
  data: CreateEmailRecipientInput,
): Promise<AppResponseWrapper<EmailRecipient>> {
  try {
    const existing = await prisma.emailRecipient.findFirst({
      where: {
        userId,
        email: data.email,
      },
    });

    if (existing) {
      return createErrorResponse("Email recipient already exists");
    }

    const recipient = await prisma.emailRecipient.create({
      data: {
        userId,

        name: data.name,

        email: data.email,

        consecutiveThreshold: data.consecutiveThreshold,
      },
    });

    return createSuccessResponse(
      "Email recipient created successfully",
      recipient,
    );
  } catch {
    return createErrorResponse("Failed to create email recipient");
  }
}

export async function updateEmailRecipient(
  userId: number,
  data: UpdateEmailRecipientInput,
): Promise<AppResponseWrapper<EmailRecipient>> {
  try {
    const existing = await prisma.emailRecipient.findFirst({
      where: {
        id: data.id,
        userId,
      },
    });

    if (!existing) {
      return createErrorResponse("Email recipient not found");
    }

    const duplicate = await prisma.emailRecipient.findFirst({
      where: {
        userId,
        email: data.email,

        NOT: {
          id: data.id,
        },
      },
    });

    if (duplicate) {
      return createErrorResponse("Email recipient already exists");
    }

    const recipient = await prisma.emailRecipient.update({
      where: {
        id: data.id,
      },

      data: {
        name: data.name,

        email: data.email,

        consecutiveThreshold: data.consecutiveThreshold,
      },
    });

    return createSuccessResponse(
      "Email recipient updated successfully",
      recipient,
    );
  } catch {
    return createErrorResponse("Failed to update email recipient");
  }
}

export async function deleteEmailRecipient(
  userId: number,
  recipientId: number,
): Promise<AppResponseWrapper> {
  try {
    const recipient = await prisma.emailRecipient.findFirst({
      where: {
        id: recipientId,
        userId,
      },
    });

    if (!recipient) {
      return createErrorResponse("Email recipient not found");
    }

    const usageCount = await prisma.monitorEmailRecipient.count({
      where: {
        recipientId,
      },
    });

    if (usageCount > 0) {
      return createErrorResponse(
        "Cannot delete recipient because it is assigned to one or more monitors",
      );
    }

    await prisma.emailRecipient.delete({
      where: {
        id: recipientId,
      },
    });

    return createSuccessResponse("Email recipient deleted successfully", null);
  } catch {
    return createErrorResponse("Failed to delete email recipient");
  }
}

export async function getAllEmailRecipients(
  userId: number,
): Promise<AppResponseWrapper<EmailRecipientType[]>> {
  try {
    const recipients = await prisma.emailRecipient.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return createSuccessResponse(
      "Email recipients fetched successfully",
      recipients as EmailRecipientType[],
    );
  } catch {
    return createErrorResponse("Failed to fetch email recipients");
  }
}

export async function getEmailRecipientById(
  userId: number,
  recipientId: number,
): Promise<AppResponseWrapper<EmailRecipient>> {
  try {
    const recipient = await prisma.emailRecipient.findFirst({
      where: {
        id: recipientId,
        userId,
      },
    });

    if (!recipient) {
      return createErrorResponse("Email recipient not found");
    }

    return createSuccessResponse(
      "Email recipient fetched successfully",
      recipient,
    );
  } catch {
    return createErrorResponse("Failed to fetch email recipient");
  }
}
