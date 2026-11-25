import { generateRobotsTxt } from '@data/robotic';

export async function GET() {
  return new Response(generateRobotsTxt(), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
