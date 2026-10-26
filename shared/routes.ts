import { z } from 'zod';
import { insertJobRoleSchema, jobRoles, analyses, analyzeResumeSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  jobRoles: {
    list: {
      method: 'GET' as const,
      path: '/api/job-roles',
      responses: {
        200: z.array(z.custom<typeof jobRoles.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/job-roles/:id',
      responses: {
        200: z.custom<typeof jobRoles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  analyze: {
    create: {
      method: 'POST' as const,
      path: '/api/analyze',
      input: analyzeResumeSchema,
      responses: {
        200: z.custom<typeof analyses.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
