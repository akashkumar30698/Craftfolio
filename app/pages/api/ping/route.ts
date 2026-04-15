export async function GET() {
  try {
    await fetch("https://your-domain.vercel.app", {
      cache: "no-store",
    });

    return new Response("Pinged homepage", { status: 200 });
  } catch (err) {
    return new Response("Error pinging", { status: 500 });
  }
}