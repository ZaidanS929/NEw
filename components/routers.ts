import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { storagePut } from "./storage";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  upload: router({
    image: protectedProcedure
      .input(z.object({
        file: z.string(), // base64 encoded image
        filename: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Convert base64 to buffer
        const base64Data = input.file.split(',')[1] || input.file;
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Determine content type from filename
        const ext = input.filename.split('.').pop()?.toLowerCase();
        const contentTypeMap: Record<string, string> = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp',
        };
        const contentType = contentTypeMap[ext || ''] || 'image/jpeg';
        
        // Upload to S3
        const timestamp = Date.now();
        const key = `articles/${timestamp}-${input.filename}`;
        const result = await storagePut(key, buffer, contentType);
        
        return { url: result.url };
      }),
  }),

  articles: router({
    // Public procedures
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        publishedOnly: z.boolean().default(true),
      }))
      .query(async ({ input }) => {
        if (input.category) {
          return await db.getArticlesByCategory(input.category, input.publishedOnly);
        }
        return await db.getAllArticles(input.publishedOnly);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const article = await db.getArticleBySlug(input.slug);
        if (!article) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Article not found' });
        }
        return article;
      }),

    // Admin procedures
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        category: z.string().default('fashion'),
        featuredImage: z.string().optional(),
        galleryImages: z.string().optional(),
        published: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        const publishedAt = input.published ? new Date() : null;
        await db.createArticle({
          ...input,
          published: input.published ? 1 : 0,
          authorId: ctx.user.id,
          publishedAt,
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        category: z.string().optional(),
        featuredImage: z.string().optional(),
        galleryImages: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        
        const updateData: Record<string, unknown> = {};
        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.slug !== undefined) updateData.slug = updates.slug;
        if (updates.content !== undefined) updateData.content = updates.content;
        if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
        if (updates.category !== undefined) updateData.category = updates.category;
        if (updates.featuredImage !== undefined) updateData.featuredImage = updates.featuredImage;
        if (updates.galleryImages !== undefined) updateData.galleryImages = updates.galleryImages;
        if (updates.published !== undefined) {
          updateData.published = updates.published ? 1 : 0;
          if (updates.published) {
            updateData.publishedAt = new Date();
          }
        }
        
        await db.updateArticle(id, updateData);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteArticle(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
