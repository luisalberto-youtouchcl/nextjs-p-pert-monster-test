import "server-only";

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!token) return false;

  const captchaResponse = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  );

  const captchaData = await captchaResponse.json();
  if (!captchaData.success) {
    return false;
  }

  return true;
}
