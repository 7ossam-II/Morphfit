import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as dbModule from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  campaign: router({
    getLocations: publicProcedure.query(async () => {
      return dbModule.getGymLocations();
    }),
    
    logScan: publicProcedure
      .input(z.object({
        locationId: z.number(),
        redirectDestination: z.string().optional(),
        userAgent: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const location = await dbModule.getGymLocationById(input.locationId);
        if (!location) throw new TRPCError({ code: "NOT_FOUND" });
        
        await dbModule.logQrScan(input.locationId, input.redirectDestination, input.userAgent);
        
        // Send real-time notification to owner
        try {
          await notifyOwner({
            title: `QR Scan: ${location.name}`,
            content: `Location: ${location.name}\nTime: ${new Date().toLocaleString()}`,
          });
        } catch (error) {
          console.error("[Campaign] Failed to notify owner:", error);
        }
        
        return { success: true, location };
      }),
    
    getScanStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      
      const scans = await dbModule.getAllQrScans();
      const locations = await dbModule.getGymLocations();
      
      const stats = locations.map((loc: any) => {
        const locScans = scans.filter((s: any) => s.locationId === loc.id);
        return {
          location: loc,
          scanCount: locScans.length,
          lastScan: locScans.sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime())[0]?.timestamp,
        };
      });
      
      return stats;
    }),
    
    addEmailSignup: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const result = await dbModule.addEmailSignup(input.email);
        return { success: !!result };
      }),
  }),
});

export type AppRouter = typeof appRouter;
