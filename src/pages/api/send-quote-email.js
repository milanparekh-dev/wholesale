import ExcelJS from "exceljs";
import nodemailer from "nodemailer";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

async function buildQuoteWorkbook({ customer, items }) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "NYPX";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Quote");
  sheet.columns = [
    { header: "UPC", key: "upc", width: 18 },
    { header: "Product", key: "title", width: 48 },
    { header: "Brand", key: "brand", width: 22 },
    { header: "Vendor", key: "vendor_name", width: 18 },
    { header: "SKU", key: "sku", width: 16 },
    { header: "Qty", key: "qty", width: 8 },
    { header: "Price", key: "price", width: 12 },
    { header: "Line Total", key: "lineTotal", width: 14 },
  ];

  const safeItems = Array.isArray(items) ? items : [];
  let grandTotal = 0;

  for (const item of safeItems) {
    const qty = Math.max(1, Math.floor(asNumber(item?.qty, 1)));
    const price = asNumber(item?.price, 0);
    const lineTotal = qty * price;
    grandTotal += lineTotal;

    sheet.addRow({
      upc: item?.upc ?? "",
      title: item?.title ?? "",
      brand: item?.brand ?? "",
      vendor_name: item?.vendor_name ?? "",
      sku: item?.sku ?? "",
      qty,
      price,
      lineTotal,
    });
  }

  // Style header
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.getColumn("price").numFmt = "$0.00";
  sheet.getColumn("lineTotal").numFmt = "$0.00";

  // Summary
  sheet.addRow({});
  const totalRow = sheet.addRow({ title: "TOTAL", lineTotal: grandTotal });
  totalRow.font = { bold: true };
  totalRow.getCell("lineTotal").numFmt = "$0.00";

  // Customer sheet
  const customerSheet = workbook.addWorksheet("Customer");
  customerSheet.columns = [
    { header: "Field", key: "field", width: 18 },
    { header: "Value", key: "value", width: 48 },
  ];
  customerSheet.getRow(1).font = { bold: true };
  customerSheet.addRow({ field: "Name", value: customer?.name || "" });
  customerSheet.addRow({ field: "Email", value: customer?.email || "" });
  customerSheet.addRow({ field: "Company", value: customer?.company || "" });
  customerSheet.addRow({ field: "Phone", value: customer?.phone || "" });
  customerSheet.addRow({ field: "Note", value: customer?.note || "" });
  customerSheet.addRow({ field: "Created", value: new Date().toISOString() });

  return workbook;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { customer, items } = req.body || {};

    if (!customer || !isNonEmptyString(customer.name) || !isNonEmptyString(customer.email)) {
      return res.status(400).json({ message: "customer.name and customer.email are required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items must be a non-empty array" });
    }

    const smtpHost = requireEnv("SMTP_HOST");
    const smtpPort = Number(requireEnv("SMTP_PORT"));
    const smtpUser = requireEnv("SMTP_USER");
    const smtpPass = requireEnv("SMTP_PASS");
    const mailFrom = process.env.SMTP_FROM || smtpUser;
    const quoteTo = process.env.QUOTE_TO || mailFrom;

    const workbook = await buildQuoteWorkbook({ customer, items });
    const buffer = await workbook.xlsx.writeBuffer();

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const subject = `Quote Request - ${customer.name}`;
    const text =
      `New quote request\n\n` +
      `Name: ${customer.name}\n` +
      `Email: ${customer.email}\n` +
      (customer.company ? `Company: ${customer.company}\n` : "") +
      (customer.phone ? `Phone: ${customer.phone}\n` : "") +
      (customer.note ? `Note: ${customer.note}\n` : "");

    await transporter.sendMail({
      from: mailFrom,
      to: quoteTo,
      cc: customer.email,
      subject,
      text,
      attachments: [
        {
          filename: `quote-${Date.now()}.xlsx`,
          content: Buffer.from(buffer),
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    });

    return res.status(200).json({ status: "success" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err?.message || "Failed to send quote" });
  }
}
