// Payments removed: app is public catalog + cart + emailed quote.
export default async function handler(_req, res) {
  return res.status(410).json({
    error: "Payments disabled",
    message: "This endpoint was removed. Use /api/send-quote-email to request a quote.",
  });
}
