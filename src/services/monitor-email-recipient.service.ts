import { prisma } from "@/lib/prisma";
import { Prisma, EmailRecipient } from "../../generated/prisma/client";

export async function assignRecipientsToMonitor(
  tx: Prisma.TransactionClient,
  userId: number,
  monitorId: number,
  recipientIds: number[],
): Promise<void> {
  const monitor = await tx.monitor.findFirst({
    where: {
      id: monitorId,
      userId,
    },
  });

  if (!monitor) {
    throw new Error("Monitor not found");
  }

  const recipients = await tx.emailRecipient.findMany({
    where: {
      id: {
        in: recipientIds,
      },
      userId,
    },
  });

  if (recipients.length !== recipientIds.length) {
    throw new Error("One or more email recipients not found");
  }

  const existingAssignments = await tx.monitorEmailRecipient.findMany({
    where: {
      monitorId,
    },
  });

  const existingIds = existingAssignments.map((item) => item.recipientId);

  const toDelete = existingIds.filter((id) => !recipientIds.includes(id));

  const toInsert = recipientIds.filter((id) => !existingIds.includes(id));

  await tx.monitorEmailRecipient.deleteMany({
    where: {
      monitorId,

      recipientId: {
        in: toDelete,
      },
    },
  });

  await tx.monitorEmailRecipient.createMany({
    data: toInsert.map((recipientId) => ({
      monitorId,
      recipientId,
    })),

    skipDuplicates: true,
  });
}

export async function getMonitorRecipients(
  monitorId: number,
): Promise<EmailRecipient[]> {
  const assignments = await prisma.monitorEmailRecipient.findMany({
    where: {
      monitorId,
    },

    include: {
      recipient: true,
    },
  });

  return assignments.map((assignment) => assignment.recipient);
}
