import fs from "node:fs";
import path from "node:path";
import { createMailer } from "./mailer.js";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatMoney = (value) => `${Number(value || 0).toFixed(2)} TND`;

const getOrderInboxEmail = () => process.env.ORDERS_TO_EMAIL || process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER || "";

const getOrderFromEmail = () => `"Palina Orders" <${process.env.SMTP_USER}>`;

const getLogoAttachments = () => {
  const logoPath = path.resolve(process.cwd(), "public", "logo-palina.png");

  if (!fs.existsSync(logoPath)) {
    return [];
  }

  return [
    {
      filename: "logo-palina.png",
      path: logoPath,
      cid: "palina-logo"
    }
  ];
};

const getPaymentMethodLabel = (order) => (order.paymentMethod === "card" ? "Card payment" : "Cash on delivery");

const getPaymentStatusLabel = (order) => {
  switch (order.paymentStatus) {
    case "paid":
      return "Paid";
    case "cash_due":
      return "Cash due on delivery";
    case "failed":
      return "Payment failed";
    default:
      return "Pending";
  }
};

const getOrderStatusLabel = (order) => {
  switch (order.orderStatus) {
    case "confirmed":
      return "Confirmed";
    case "preparing":
      return "Preparing";
    case "cancelled":
      return "Cancelled";
    default:
      return "Awaiting payment";
  }
};

const getCustomerHeading = (order) =>
  order.paymentMethod === "card" ? "Your payment is confirmed." : "Your order is confirmed.";

const getCustomerIntro = (order) =>
  order.paymentMethod === "card"
    ? "Thank you for shopping with Palina. We have received your payment and your order is now being prepared for delivery."
    : "Thank you for shopping with Palina. Your order has been received and will be prepared for delivery. Payment will be collected on delivery.";

const getCustomerClosing = () =>
  "Our team will prepare your order with care and you will receive it as quickly as possible.";

const formatOrderItemsHtml = (order) =>
  order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #dce5f1;">
          <div style="font-weight:700;color:#11213e;">${escapeHtml(item.name)}</div>
          <div style="margin-top:4px;color:#5d7393;font-size:13px;">${escapeHtml(
            [item.gender, item.size ? `Size ${item.size}` : null].filter(Boolean).join(" | ") || "Padel apparel"
          )}</div>
        </td>
        <td align="center" style="padding:14px 0;border-bottom:1px solid #dce5f1;color:#11213e;">${item.quantity}</td>
        <td align="right" style="padding:14px 0;border-bottom:1px solid #dce5f1;color:#11213e;font-weight:700;">${formatMoney(item.subtotalTnd)}</td>
      </tr>`
    )
    .join("");

const formatOrderItemsText = (order) =>
  order.items
    .map((item) => `- ${item.name}${item.size ? ` (Size ${item.size})` : ""} x${item.quantity}: ${formatMoney(item.subtotalTnd)}`)
    .join("\n");

const renderSummaryHtml = (order) => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:22px;">
    <tr>
      <td style="padding:0 0 10px;color:#5d7393;">Subtotal</td>
      <td align="right" style="padding:0 0 10px;color:#11213e;font-weight:700;">${formatMoney(order.totals.subtotalTnd)}</td>
    </tr>
    <tr>
      <td style="padding:0 0 10px;color:#5d7393;">Delivery</td>
      <td align="right" style="padding:0 0 10px;color:#11213e;font-weight:700;">${formatMoney(order.totals.deliveryTnd)}</td>
    </tr>
    <tr>
      <td style="padding:0 0 10px;color:#5d7393;">VAT</td>
      <td align="right" style="padding:0 0 10px;color:#11213e;font-weight:700;">${formatMoney(order.totals.vatTnd)}</td>
    </tr>
    <tr>
      <td style="padding-top:14px;border-top:1px solid #dce5f1;color:#11213e;font-size:16px;font-weight:800;">Total</td>
      <td align="right" style="padding-top:14px;border-top:1px solid #dce5f1;color:#173f99;font-size:18px;font-weight:900;">${formatMoney(order.totals.totalTnd)}</td>
    </tr>
  </table>
`;

const renderLayout = ({ eyebrow, title, intro, body, footer }) => `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#071528;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#071528;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:760px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #d6e0ee;">
            <tr>
              <td style="padding:30px 32px;background:linear-gradient(135deg,#102d73,#071528);">
                <img src="cid:palina-logo" alt="Palina" style="display:block;width:210px;max-width:100%;height:auto;" />
                <p style="margin:22px 0 10px;color:#83f6e4;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;">${eyebrow}</p>
                <h1 style="margin:0;color:#ffffff;font-size:32px;line-height:1.2;">${title}</h1>
                <p style="margin:14px 0 0;color:#dce7ff;font-size:15px;line-height:1.75;">${intro}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 32px;color:#11213e;">${body}</td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background:#eef4ff;color:#5f7392;font-size:13px;">${footer}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const formatCustomerOrderHtml = (order) =>
  renderLayout({
    eyebrow: "Palina order confirmation",
    title: getCustomerHeading(order),
    intro: getCustomerIntro(order),
    body: `
      <div style="padding:18px 20px;border-radius:18px;background:#f5f8fe;border:1px solid #dce5f1;">
        <p style="margin:0 0 8px;color:#5d7393;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Invoice summary</p>
        <p style="margin:0;color:#11213e;font-size:15px;line-height:1.8;">
          <strong>Order:</strong> ${escapeHtml(order.orderNumber)}<br />
          <strong>Payment:</strong> ${escapeHtml(getPaymentMethodLabel(order))}<br />
          <strong>Status:</strong> ${escapeHtml(getPaymentStatusLabel(order))}<br />
          <strong>Delivery:</strong> ${escapeHtml(order.customer.addressLine1)}, ${escapeHtml(order.customer.city)}${order.customer.postalCode ? `, ${escapeHtml(order.customer.postalCode)}` : ""}
        </p>
      </div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;">
        <tr>
          <td colspan="3" style="padding-bottom:10px;color:#5d7393;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Order details</td>
        </tr>
        <tr>
          <td style="padding:0 0 10px;color:#11213e;font-weight:700;">Product</td>
          <td align="center" style="padding:0 0 10px;color:#11213e;font-weight:700;">Qty</td>
          <td align="right" style="padding:0 0 10px;color:#11213e;font-weight:700;">Amount</td>
        </tr>
        ${formatOrderItemsHtml(order)}
      </table>

      ${renderSummaryHtml(order)}

      <div style="margin-top:24px;padding:18px 20px;border-radius:18px;background:#081c3d;color:#dce7ff;">
        <p style="margin:0;color:#ffffff;font-size:18px;font-weight:800;">What happens next</p>
        <p style="margin:10px 0 0;font-size:14px;line-height:1.8;">${getCustomerClosing()}</p>
      </div>
    `,
    footer: "Palina 2026 | Tunisian padel apparel made for performance, style and movement."
  });

const formatAdminOrderHtml = (order) =>
  renderLayout({
    eyebrow: "Palina admin alert",
    title: "A new order has been placed.",
    intro: "A customer completed a new order on the Palina storefront. Review the details below and start the fulfillment process.",
    body: `
      <div style="display:block;padding:18px 20px;border-radius:18px;background:#f5f8fe;border:1px solid #dce5f1;">
        <p style="margin:0 0 8px;color:#5d7393;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Order overview</p>
        <p style="margin:0;color:#11213e;font-size:15px;line-height:1.85;">
          <strong>Order:</strong> ${escapeHtml(order.orderNumber)}<br />
          <strong>Customer:</strong> ${escapeHtml(order.customer.name)}<br />
          <strong>Email:</strong> <a href="mailto:${escapeHtml(order.customer.email)}" style="color:#173f99;text-decoration:none;">${escapeHtml(order.customer.email)}</a><br />
          <strong>Phone:</strong> ${escapeHtml(order.customer.phone)}<br />
          <strong>Address:</strong> ${escapeHtml(order.customer.addressLine1)}, ${escapeHtml(order.customer.city)}${order.customer.postalCode ? `, ${escapeHtml(order.customer.postalCode)}` : ""}<br />
          <strong>Payment method:</strong> ${escapeHtml(getPaymentMethodLabel(order))}<br />
          <strong>Payment status:</strong> ${escapeHtml(getPaymentStatusLabel(order))}<br />
          <strong>Order status:</strong> ${escapeHtml(getOrderStatusLabel(order))}
        </p>
      </div>

      ${order.customer.notes ? `
      <div style="margin-top:22px;padding:18px 20px;border-radius:18px;background:#fff9ef;border:1px solid #efdcb3;">
        <p style="margin:0 0 8px;color:#8a6a17;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Customer note</p>
        <p style="margin:0;color:#11213e;font-size:15px;line-height:1.8;">${escapeHtml(order.customer.notes)}</p>
      </div>` : ""}

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px;">
        <tr>
          <td colspan="3" style="padding-bottom:10px;color:#5d7393;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Items to prepare</td>
        </tr>
        <tr>
          <td style="padding:0 0 10px;color:#11213e;font-weight:700;">Product</td>
          <td align="center" style="padding:0 0 10px;color:#11213e;font-weight:700;">Qty</td>
          <td align="right" style="padding:0 0 10px;color:#11213e;font-weight:700;">Amount</td>
        </tr>
        ${formatOrderItemsHtml(order)}
      </table>

      ${renderSummaryHtml(order)}
    `,
    footer: "Direct destination inbox for Palina orders and fulfillment."
  });

const formatCustomerOrderText = (order) => `Palina order confirmation

Order: ${order.orderNumber}
Payment method: ${getPaymentMethodLabel(order)}
Payment status: ${getPaymentStatusLabel(order)}
Delivery address: ${order.customer.addressLine1}, ${order.customer.city}${order.customer.postalCode ? `, ${order.customer.postalCode}` : ""}

Items:
${formatOrderItemsText(order)}

Subtotal: ${formatMoney(order.totals.subtotalTnd)}
Delivery: ${formatMoney(order.totals.deliveryTnd)}
VAT: ${formatMoney(order.totals.vatTnd)}
Total: ${formatMoney(order.totals.totalTnd)}

${getCustomerClosing()}`;

const formatAdminOrderText = (order) => `New Palina order

Order: ${order.orderNumber}
Customer: ${order.customer.name}
Email: ${order.customer.email}
Phone: ${order.customer.phone}
Address: ${order.customer.addressLine1}, ${order.customer.city}${order.customer.postalCode ? `, ${order.customer.postalCode}` : ""}
Payment method: ${getPaymentMethodLabel(order)}
Payment status: ${getPaymentStatusLabel(order)}
Order status: ${getOrderStatusLabel(order)}

Items:
${formatOrderItemsText(order)}

Subtotal: ${formatMoney(order.totals.subtotalTnd)}
Delivery: ${formatMoney(order.totals.deliveryTnd)}
VAT: ${formatMoney(order.totals.vatTnd)}
Total: ${formatMoney(order.totals.totalTnd)}
${order.customer.notes ? `\nCustomer note: ${order.customer.notes}` : ""}`;

export const sendOrderNotifications = async (order) => {
  const mailer = createMailer();
  const orderInboxEmail = getOrderInboxEmail();

  if (!mailer || !orderInboxEmail || !order?.customer?.email) {
    return;
  }

  const attachments = getLogoAttachments();
  let orderChanged = false;

  if (!order.customerEmailSentAt) {
    try {
      await mailer.sendMail({
        from: getOrderFromEmail(),
        to: order.customer.email,
        subject:
          order.paymentMethod === "card"
            ? `Palina payment confirmed | ${order.orderNumber}`
            : `Palina order confirmed | ${order.orderNumber}`,
        text: formatCustomerOrderText(order),
        html: formatCustomerOrderHtml(order),
        attachments
      });

      order.customerEmailSentAt = new Date();
      orderChanged = true;
    } catch (error) {
      console.error("Unable to send customer order email:", error.message);
    }
  }

  if (!order.adminEmailSentAt) {
    try {
      await mailer.sendMail({
        from: getOrderFromEmail(),
        replyTo: order.customer.email,
        to: orderInboxEmail,
        subject: `New Palina order | ${order.orderNumber}`,
        text: formatAdminOrderText(order),
        html: formatAdminOrderHtml(order),
        attachments
      });

      order.adminEmailSentAt = new Date();
      orderChanged = true;
    } catch (error) {
      console.error("Unable to send admin order email:", error.message);
    }
  }

  if (orderChanged) {
    await order.save();
  }
};
