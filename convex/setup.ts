import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * Initialize the system with an admin user and business profile
 * This is used for testing and development
 */
export const initializeSystem = action({
  args: {},
  handler: async (ctx): Promise<{
    success: boolean;
    adminUser: any;
    businessProfile: any;
  }> => {
    // Check if admin user exists
    let adminUser: any = await ctx.runQuery(api.users.getFirstAdmin, {});

    // If no admin user exists, create one
    if (!adminUser) {
      const adminId = await ctx.runMutation(api.users.create, {
        name: "System Admin",
        email: "admin@pickle.com",
        role: "admin",
      });

      adminUser = await ctx.runQuery(api.users.getById, { id: adminId });
    }

    // Check if admin has a business profile
    let businessProfile: any = await ctx.runQuery(api.businessProfiles.getByUserId, {
      userId: adminUser._id,
    });

    // If no business profile exists, create one
    if (!businessProfile) {
      const profileId = await ctx.runMutation(api.businessProfiles.createDefaultForAdmin, {
        userId: adminUser._id,
      });

      businessProfile = await ctx.runQuery(api.businessProfiles.getById, { id: profileId.profileId });
    }

    return {
      success: true,
      adminUser,
      businessProfile,
    };
  },
});
