import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tenants: defineTable({
    _id: v.id("tenants"),
    organizationId: v.id("organizations"),
    clerkOrgId: v.string(),
    slug: v.string(),
    userId: v.id("users"),
    name: v.string(),
    subdomain: v.string(),
    settings: v.object({
      businessHours: v.array(
        v.object({
          day: v.string(),
          start: v.string(),
          end: v.string(),
        })
      ),
      servicesDuration: v.union(v.string(), v.number()),
      googleCredentials: v.object({
        accessToken: v.string(),
        refreshToken: v.string(),
        expiryDate: v.number(),
      }),
    }),
  }).index("by_subdomain", ["subdomain"]),

  services: defineTable({
    _id: v.id('services'),
    tenantId: v.id("tenants"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    duration: v.number(),
  }).index("by_tenant", ["tenantId"]),



  customers: defineTable({
    _id: v.id("customers"),
    tenantId: v.id("tenants"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
  }).index("by_tenant_email", ["tenantId", "email"]),

  vehicles: defineTable({
    _id: v.id("vehicles"),
    tenantId: v.id("tenants"),
    customerId: v.id("customers"),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    VIN: v.string(),
    lastService: v.optional(v.string()),
  }).index("by_customer", ["customerId"]),

  serviceHistory: defineTable({
    _id: v.id("serviceHistory"),
    tenantId: v.id('tenants'),
    appointmentId: v.id("appointments"),
    vehicleId: v.id("vehicles"),
    clientId: v.id('clients'),
    notes: v.string(),
    recommendations: v.array(v.string()),
  }).index("by_vehicle", ["vehicleId"])
    .index("by_client", ["clientId"]),


  users: defineTable({
    _id: v.id("users"),
    clerkId: v.id('users'),
    organizationName: v.string(),
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    clerkOrgId: v.string(),
    email: v.string(),
    name: v.string(),
    password: v.string(),
    role: v.string(),
    tenantId: v.id("tenants"),
    imageUrl: v.optional(v.string()),
    phone: v.optional(v.string()),
    locationId: v.optional(v.id("locations")),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_tenant", ["tenantId"])
    .index("by_location", ["locationId"]),

  organizations: defineTable({
    _id: v.id("organizations"),
    tenantId: v.id("tenants"),
    userId: v.id("users"),
    slug: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    address: v.string(),
    phoneNumber: v.string(),
    clerkOrgId: v.string(),
  }).index("by_clerk_org_id", ["clerkOrgId"]),

  locations: defineTable({
    _id: v.id("locations"),
    tenantId: v.id("tenants"),
    organizationId: v.id("organizations"),
    name: v.string(),
    address: v.string(),
  }).index("by_organization", ["organizationId"]),

  appointments: defineTable({
    _id: v.id("appointments"),
    serviceId: v.array(v.id("services")),
    tenantId: v.id("tenants"),
    date: v.string(),
    customerId: v.id("users"),
    detailerId: v.id("detailers"),
    status: v.string(),
    price: v.number(),
  })
    .index("by_tenant_and_date", ["tenantId", "date"])
    .index("by_customer", ["customerId"])
    .index("by_service", ["serviceId"]),

  detailers: defineTable({
    _id: v.id("detailers"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    tenantId: v.id("tenants"),
  }).index("by_tenant", ["tenantId"]),

  notifications: defineTable({
    _id: v.id("notifications"),
    tenantId: v.id("tenants"),
    userId: v.id("users"),
    message: v.string(),
    type: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_tenant_and_user", ["tenantId", "userId"])
    .index("by_user_and_read", ["userId", "read"]),

  inventory: defineTable({
    _id: v.id("inventory"),
    tenantId: v.id("tenants"),
    locationId: v.id("locations"),
    itemName: v.string(),
    quantity: v.number(),
    price: v.number(),
    type: v.string(),
    description: v.string(),
    image: v.string(),
    expiry: v.string(),
    upcNumber: v.number(),
    unit: v.string(),
    lowThreshold: v.number(),
    reorderPoint: v.number(),
    reorderQuantity: v.number(),
    status: v.string(),
    notes: v.string(),
  })
    .index("by_tenant_and_location", ["tenantId", "locationId"])
    .index("by_tenant_and_item", ["tenantId", "itemName"]),

  servicePopularityInsights: defineTable({
    _id: v.id("servicePopularityInsights"),
    tenantId: v.string(),
    serviceType: v.union(v.literal('basic-wash'), v.literal('full-detailing'), v.literal('premium-package')),
    book: v.number(),
    cancel: v.number(),
    reschedule: v.number(),
    complete: v.number(),
    total: v.number(),
  }),
  timeSlotPopularityInsights: defineTable({
    _id: v.id("timeSlotPopularityInsights"),
    tenantId: v.string(),
    dayOfWeek: v.number(),
    hour: v.number(),
    book: v.number(),
    cancel: v.number(),
    reschedule: v.number(),
    complete: v.number(),
    total: v.number(),
  }),

  customerRequests: defineTable({
    _id: v.id('customerRequests'),
    tenantId: v.string(),
    serviceType: v.string(),
    userId: v.string(),
    originalRequest: v.string(),
    processedRequest: v.object({
      intent: v.string(),
      serviceType: v.string(),
      dateTime: v.string(),
      vehicleType: v.string(),
    }),
    timestamp: v.string(),
  }),

  nlpFeedback: defineTable({
    _id: v.id('nlpFeedback'),
    tenantId: v.string(),
    requestId: v.id('customerRequests'),
    correct: v.boolean(),
    correctedData: v.optional(v.object({
      intent: v.string(),
      serviceType: v.string(),
      dateTime: v.string(),
      vehicleType: v.string(),
    })),
    timestamp: v.string(),
  }),

  modelFineTuningLogs: defineTable({
    _id: v.id('modelFineTuningLogs'),
    tenantId: v.string(),
    requestId: v.id('customerRequests'),
    intent: v.string(),
    serviceType: v.string(),
    dateTime: v.string(),
    timestamp: v.string(),
    feedbackCount: v.number(),
  }),
})