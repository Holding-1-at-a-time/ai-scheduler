import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const getServiceRecommendations = action({
  args: { tenantId: v.id("tenants"), vehicleId: v.id("vehicles") },
  handler: async (ctx, args) => {
    const vehicle = await ctx.runQuery(api.vehicles.getVehicle, { id: args.vehicleId });
    if (!vehicle) throw new Error("Vehicle not found");

    const serviceHistory = await ctx.runQuery(api.serviceHistory.getServiceHistory, { vehicleId: args.vehicleId });

    // This is where you'd typically call an external AI service
    // For this example, we'll use a simple rule-based system
    const recommendations = [];

    const lastServiceDate = vehicle.lastService ? new Date(vehicle.lastService) : null;
    const currentDate = new Date();

    if (!lastServiceDate || (currentDate.getTime() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24) > 90) {
      recommendations.push("Full Detailing");
    } else {
      recommendations.push("Basic Wash");
    }

    if (serviceHistory.length > 0) {
      const lastService = serviceHistory[0];
      if (!lastService.recommendations.includes("Paint Protection")) {
        recommendations.push("Paint Protection");
      }
    }

    // You could expand this logic based on the vehicle's make, model, year, and more sophisticated AI models

    return recommendations;
  },
});

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
