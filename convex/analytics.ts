import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Define types for Appointments, Services, Users, and Detailers
type Appointment = {
    _id: Id<"appointments">;
    tenantId: Id<"tenants">;
    serviceId: Id<"services">;
    date: string;
    customerId: Id<"users">;
    detailerId: Id<"detailers">;
    price: number;
};

type Service = {
    _id: Id<"services">;
    tenantId: Id<"tenants">;
    name: string;
    price: number;
};

type User = {
    _id: Id<"users">;
    tenantId: Id<"tenants">;
    email: string;
    role: "admin" | "user";
};

type Detailer = {
    _id: Id<"detailers">;
    tenantId: Id<"tenants">;
    name: string;
};

export const getDetailedAnalytics = query({
    args: {
        tenantId: v.id("tenants"),
        startDate: v.string(),
        endDate: v.string(),
        groupBy: v.union(
            v.literal("daily"),
            v.literal("weekly"),
            v.literal("monthly")
        ),
    },
    async handler(ctx, { tenantId, startDate, endDate, groupBy }) {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("Unauthenticated");
        }

        const userRecord = await ctx.db
            .query<User, "users">("users")
            .withIndex("by_email", (q) => q.eq("email", user.email))
            .first();

        if (!userRecord || !isAdminForTenant(userRecord, tenantId)) {
            throw new Error(
                "Unauthorized: User does not have admin access to this tenant"
            );
        }

        const appointments = await ctx.db
            .query<Appointment>("appointments")
            .withIndex("by_tenant_and_date", (q) =>
                q.eq("tenantId", tenantId).gte("date", startDate).lte("date", endDate)
            )
            .collect();

        const services = await ctx.db
            .query<Service>("services")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .collect();

        const serviceMap = new Map(
            services.map((service) => [service._id, service])
        );

        const groupedData = groupByTimePeriod(appointments, groupBy, serviceMap);
        const overallMetrics = calculateOverallMetrics(appointments, serviceMap);
        const growth = calculateGrowth(groupedData);
        const topServices = calculateTopServices(appointments, serviceMap);
        const customerRetention = await calculateCustomerRetention(
            ctx,
            tenantId,
            startDate,
            endDate
        );

        return {
            groupedData,
            overallMetrics,
            growth,
            topServices,
            customerRetention,
        };
    },
});

function isAdminForTenant(userRecord: User, tenantId: Id<"tenants">): boolean {
    return userRecord.tenantId === tenantId && userRecord.role === "admin";
}

function calculateOverallMetrics(
    appointments: readonly Appointment[],
    serviceMap: Map<Id<"services">, Service>
): {
    totalAppointments: number;
    totalRevenue: number;
    averageRevenuePerAppointment: number;
} {
    const totalAppointments = appointments.length;
    const totalRevenue = appointments.reduce(
        (sum, app) => sum + (serviceMap.get(app.serviceId)?.price || 0),
        0
    );
    return {
        totalAppointments,
        totalRevenue,
        averageRevenuePerAppointment:
            totalAppointments > 0 ? totalRevenue / totalAppointments : 0,
    };
}

function calculateGrowth(
    groupedData: Record<string, { appointments: number; revenue: number }>
): { appointments: number; revenue: number } | null {
    const periods = Object.keys(groupedData).sort();
    if (periods.length < 2) return null;

    const firstPeriod = groupedData[periods[0]];
    const lastPeriod = groupedData[periods[periods.length - 1]];

    return {
        appointments:
            (lastPeriod.appointments - firstPeriod.appointments) /
            firstPeriod.appointments,
        revenue: (lastPeriod.revenue - firstPeriod.revenue) / firstPeriod.revenue,
    };
}

function calculateTopServices(
    appointments: readonly Appointment[],
    serviceMap: Map<Id<"services">, Service>
): readonly {
    serviceId: Id<"services">;
    name: string;
    count: number;
    revenue: number;
}[] {
    const serviceCounts = appointments.reduce<Map<Id<"services">, number>>(
        (acc, app) => {
            acc.set(app.serviceId, (acc.get(app.serviceId) || 0) + 1);
            return acc;
        },
        new Map()
    );

    return Array.from(serviceCounts.entries())
        .map(([serviceId, count]) => ({
            serviceId,
            name: serviceMap.get(serviceId)?.name || "Unknown",
            count,
            revenue: count * (serviceMap.get(serviceId)?.price || 0),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
}

function groupByTimePeriod<T extends "daily" | "weekly" | "monthly">(
    appointments: readonly Appointment[],
    groupBy: T,
    serviceMap: Map<Id<"services">, Service>
): Record<string, { appointments: number; revenue: number }> {
    return appointments.reduce(
        (acc, appointment) => {
            const date = new Date(appointment.date);
            let key: string;
            switch (groupBy) {
                case "daily":
                    key = appointment.date;
                    break;
                case "weekly":
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split("T")[0];
                    break;
                case "monthly":
                    key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                    break;
            }
            if (!acc[key]) {
                acc[key] = { appointments: 0, revenue: 0 };
            }
            acc[key].appointments++;
            acc[key].revenue += serviceMap.get(appointment.serviceId)?.price || 0;
            return acc;
        },
        {} as Record<string, { appointments: number; revenue: number }>
    );
}

async function calculateCustomerRetention(
    ctx: QueryCtx,
    tenantId: Id<"tenants">,
    startDate: string,
    endDate: string
) {
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);
    const previousPeriodEnd = new Date(endDate);
    previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 30);

    const currentPeriodCustomers = await getUniqueCustomers(
        ctx,
        tenantId,
        startDate,
        endDate
    );
    const previousPeriodCustomers = await getUniqueCustomers(
        ctx,
        tenantId,
        previousPeriodStart.toISOString().split("T")[0],
        previousPeriodEnd.toISOString().split("T")[0]
    );

    const retainedCustomers = currentPeriodCustomers.filter((customer) =>
        previousPeriodCustomers.includes(customer)
    );

    return {
        retentionRate:
            previousPeriodCustomers.length > 0
                ? retainedCustomers.length / previousPeriodCustomers.length
                : 0,
        newCustomers: currentPeriodCustomers.filter(
            (customer) => !previousPeriodCustomers.includes(customer)
        ).length,
        lostCustomers: previousPeriodCustomers.filter(
            (customer) => !currentPeriodCustomers.includes(customer)
        ).length,
    };
}

async function getUniqueCustomers(
    ctx: QueryCtx,
    tenantId: Id<"tenants">,
    startDate: string,
    endDate: string
): Promise<readonly Id<"users">[]> {
    const appointments = await ctx.db
        .query<Appointment>("appointments")
        .withIndex("by_tenant_and_date", (q) =>
            q.eq("tenantId", tenantId).gte("date", startDate).lte("date", endDate)
        )
        .collect();

    return Array.from(new Set(appointments.map((app) => app.customerId)));
}

// Example of another query for customer lifetime value
export const getCustomerLifetimeValue = query({
    args: {
        tenantId: v.id("tenants"),
        customerId: v.id("users"),
    },
    handler: async (
        ctx: QueryCtx,
        {
            tenantId,
            customerId,
        }: { tenantId: Id<"tenants">; customerId: Id<"users"> }
    ): Promise<{
        totalRevenue: number;
        averageRevenuePerAppointment: number;
        totalAppointments: number;
        customerLifespanDays: number;
        lifetimeValue: number;
    }> => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new Error("Unauthenticated");

        const userRecord = await ctx.db
            .query<User>("users")
            .withIndex("by_email", (q) => q.eq("email", user.email))
            .first();
        if (
            !userRecord ||
            userRecord.tenantId !== tenantId ||
            userRecord.role !== "admin"
        ) {
            throw new Error(
                "Unauthorized: User does not have admin access to this tenant"
            );
        }

        const appointments = await ctx.db
            .query<Appointment>("appointments")
            .withIndex("by_customer", (q) => q.eq("customerId", customerId))
            .collect();

        const services = await ctx.db
            .query<Service>("services")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .collect();

        const serviceMap = new Map(
            services.map((service) => [service._id, service])
        );

        const totalRevenue = appointments.reduce(
            (sum, app) => sum + (serviceMap.get(app.serviceId)?.price || 0),
            0
        );
        const averageRevenue =
            appointments.length > 0 ? totalRevenue / appointments.length : 0;

        const firstAppointmentDate = new Date(
            Math.min(...appointments.map((app) => new Date(app.date).getTime()))
        );
        const lastAppointmentDate = new Date(
            Math.max(...appointments.map((app) => new Date(app.date).getTime()))
        );
        const customerLifespanDays =
            (lastAppointmentDate.getTime() - firstAppointmentDate.getTime()) /
            (1000 * 3600 * 24);

        return {
            totalRevenue,
            averageRevenuePerAppointment: averageRevenue,
            totalAppointments: appointments.length,
            customerLifespanDays,
            lifetimeValue: totalRevenue * (365 / customerLifespanDays), // Projected annual value
        };
    },
});

// Example of another query for detailed service analytics
export const getDetailedServiceAnalytics = query({
    args: {
        tenantId: v.id("tenants"),
        serviceId: v.id("services"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (
        ctx: QueryCtx,
        {
            tenantId,
            serviceId,
            startDate,
            endDate,
        }: {
            tenantId: Id<"tenants">;
            serviceId: Id<"services">;
            startDate: string;
            endDate: string;
        }
    ): Promise<{
        serviceName: string;
        totalAppointments: number;
        totalRevenue: number;
        averageRevenuePerAppointment: number;
        detailerPerformance: DetailerPerformance[];
        customerSegmentation: CustomerSegmentation;
    }> => {
        const user = await ctx.auth.getUserIdentity();
        if (!user) throw new Error("Unauthenticated");

        const userRecord = await ctx.db
            .query<User>("users")
            .withIndex("by_email", (q) => q.eq("email", user.email))
            .first();
        if (
            !userRecord ||
            userRecord.tenantId !== tenantId ||
            userRecord.role !== "admin"
        ) {
            throw new Error(
                "Unauthorized: User does not have admin access to this tenant"
            );
        }

        const service = await ctx.db.get<Service>(serviceId);
        if (!service || service.tenantId !== tenantId) {
            throw new Error("Service not found or access denied");
        }

        const appointments = await ctx.db
            .query<Appointment>("appointments")
            .withIndex("by_service", (q) =>
                q.eq("serviceId", serviceId).gte("date", startDate).lte("date", endDate)
            )
            .collect();

        const totalAppointments = appointments.length;
        const totalRevenue = totalAppointments * service.price;

        const detailerPerformance = await calculateDetailerPerformance(
            ctx,
            appointments
        );
        const customerSegmentation = await calculateCustomerSegmentation(
            ctx,
            appointments
        );

        return {
            serviceName: service.name,
            totalAppointments,
            totalRevenue,
            averageRevenuePerAppointment:
                totalAppointments > 0 ? totalRevenue / totalAppointments : 0,
            detailerPerformance,
            customerSegmentation,
        };
    },
});

async function calculateDetailerPerformance(
    ctx: QueryCtx,
    appointments: Appointment[]
): Promise<DetailerPerformance[]> {
    const detailerStats: Record<
        Id<"detailers">,
        { appointments: number; revenue: number }
    > = {};

    for (const appointment of appointments) {
        const detailerId = appointment.detailerId;
        if (!detailerStats[detailerId]) {
            detailerStats[detailerId] = { appointments: 0, revenue: 0 };
        }
        detailerStats[detailerId].appointments++;
        detailerStats[detailerId].revenue += appointment.price;
    }

    const detailers = await ctx.db
        .query<Detailer>("detailers")
        .filter((q) =>
            q.inArray(
                Object.keys(detailerStats) as Array<Id<"detailers">>,
                q.field("_id")
            )
        )
        .collect();

    return detailers.map((detailer) => ({
        detailerId: detailer._id,
        name: detailer.name,
        appointments: detailerStats[detailer._id].appointments,
        revenue: detailerStats[detailer._id].revenue,
    }));
}

export type DetailerPerformance = {
    detailerId: Id<"detailers">;
    name: string;
    appointments: number;
    revenue: number;
};

async function calculateCustomerSegmentation(
    ctx: QueryCtx,
    appointments: Appointment[]
): Promise<CustomerSegmentation> {
    const customerStats: Record<
        Id<"users">,
        { appointments: number; revenue: number }
    > = {};

    for (const appointment of appointments) {
        const customerId = appointment.customerId;
        if (!customerStats[customerId]) {
            customerStats[customerId] = { appointments: 0, revenue: 0 };
        }
        customerStats[customerId].appointments++;
        customerStats[customerId].revenue += appointment.price;
    }

    const customers = await ctx.db
        .query<User>("users")
        .filter((q: QueryFilter) =>
            q.inArray(
                Object.keys(customerStats) as Array<Id<"users">>,
                q.field("_id")
            )
        )
        .collect();

    const segmentation: CustomerSegmentation = {
        newCustomers: 0,
        returningCustomers: 0,
        frequentCustomers: 0,
    };

    customers.forEach((customer) => {
        const stats = customerStats[customer._id];
        if (stats.appointments === 1) {
            segmentation.newCustomers++;
        } else if (stats.appointments < 5) {
            segmentation.returningCustomers++;
        } else {
            segmentation.frequentCustomers++;
        }
    });
    return segmentation;
}

export type CustomerSegmentation = {
    newCustomers: number;
    returningCustomers: number;
    frequentCustomers: number;
};
