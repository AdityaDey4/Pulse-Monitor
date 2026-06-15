import { prisma } from "@/lib/prisma";

export async function checkMonitor(
    monitorId: number
) {
    const monitor =
        await prisma.monitor.findUnique({
            where: {
                id: monitorId,
            },
        });

    if (!monitor) {
        return;
    }

    const startedAt = Date.now();

    try {
        const response = await fetch(
            monitor.url,
            {
                method: monitor.method,
                signal:
                    AbortSignal.timeout(10000),
            },
        );

        const responseTime =
            Date.now() - startedAt;

        await prisma.checkResult.create({
            data: {
                monitorId,
                success: response.ok,
                statusCode:
                    response.status,
                responseTime,
            },
        });

        await prisma.monitor.update({
            where: {
                id: monitorId,
            },
            data: {
                lastCheckedAt:
                    new Date(),
            },
        });

        console.log(
            `[SUCCESS] ${monitor.name}`,
        );
    } catch (error) {
        const responseTime =
            Date.now() - startedAt;

        await prisma.checkResult.create({
            data: {
                monitorId,
                success: false,
                responseTime,
                errorMessage:
                    error instanceof Error
                        ? error.message
                        : "Unknown Error",
            },
        });

        await prisma.monitor.update({
            where: {
                id: monitorId,
            },
            data: {
                lastCheckedAt:
                    new Date(),
            },
        });

        console.error(
            `[FAILED] ${monitor.name}`,
        );
    }
}
