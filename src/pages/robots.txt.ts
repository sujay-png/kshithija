// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';
import { generateRobotsTxt } from '@data/robotic';

export const GET: APIRoute = () => {
  return new Response(generateRobotsTxt(), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
