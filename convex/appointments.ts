import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAvailableSlots = query({
  args: { tenantId: v.id("tenants"), date: v.string() },
  handler: async (ctx, args) => {
    const tenant = await ctx.db.get(args.tenantId);
    if (!tenant) throw new Error("Tenant not found");

    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_tenant_date", (q) =>
        q.eq("tenantId", args.tenantId).eq("date", args.date)
      )
      .collect();

    // Implement logic to calculate available slots based on tenant's business hours and existing appointments
    // This is a simplified example
    const allSlots = [
      "09:00",
      "10:00",
      "11:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];
    const bookedSlots = appointments.map((apt) => apt.time);
    return allSlots.filter((slot) => !bookedSlots.includes(slot));
  },
});

export const createAppointment = mutation({
  args: {
    tenantId: v.id("tenants"),
    customerId: v.id("customers"),
    serviceIds: v.array(v.id("services")),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const appointmentId = await ctx.db.insert("appointments", {
      tenantId: args.tenantId,
      customerId: args.customerId,
      serviceIds: args.serviceIds,
      date: args.date,
      time: args.time,
      status: "scheduled",
    });
    return appointmentId;
  },
});

export const getAppointments = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_tenant_date", (q) => q.eq("tenantId", args.tenantId))
      .order("desc")
      .take(100);
  },
});
