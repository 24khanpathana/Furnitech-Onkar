const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'admin@onkar.local';

const sendBrevoEmail = async ({ to, subject, htmlContent }) => {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
    return { skipped: true, reason: 'Brevo credentials are not configured.' };
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: process.env.BREVO_SENDER_NAME || 'Onkar OMS',
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to,
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo email failed: ${response.status} ${errorText}`);
  }

  return response.json();
};

exports.sendOrderCreatedEmail = async (order) =>
  sendBrevoEmail({
    to: [{ email: adminEmail, name: 'Onkar Admin' }],
    subject: `New order created: ${order.orderId}`,
    htmlContent: `
      <h2>New Order Created</h2>
      <p><strong>Order ID:</strong> ${order.orderId}</p>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      <p><strong>Mobile:</strong> ${order.mobileNumber}</p>
      <p><strong>Address:</strong> ${order.address || 'N/A'}</p>
      <p><strong>Product:</strong> ${order.productName}</p>
      <p><strong>Material:</strong> ${order.materialType || 'N/A'}</p>
      <p><strong>Details:</strong> ${order.productDetails || 'N/A'}</p>
      <p><strong>Branch:</strong> ${order.branch}</p>
      <p><strong>Worker:</strong> ${order.worker?.name || order.workerName}</p>
    `,
  });

exports.sendPasswordResetEmail = async ({ user, resetCode }) =>
  sendBrevoEmail({
    to: [{ email: user.email, name: user.name }],
    subject: 'Onkar password reset code',
    htmlContent: `
      <h2>Password Reset Code</h2>
      <p>Hello ${user.name},</p>
      <p>Your Onkar reset code is <strong>${resetCode}</strong>.</p>
      <p>This code expires in 15 minutes.</p>
    `,
  });
