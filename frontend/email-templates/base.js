export function withLayout({ title, body }) {
  return `
    <div style="font-family:Arial,sans-serif;background:#faf8f5;padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e0db;">
        <div style="padding:16px 20px;background:linear-gradient(135deg,#1B1464,#FF6B35);color:#fff;">
          <h1 style="margin:0;font-size:24px;">OddFinds</h1>
          <p style="margin:4px 0 0;font-size:12px;opacity:.85;">Premium weirdness delivered</p>
        </div>
        <div style="padding:20px;">
          <h2 style="margin-top:0;color:#1B1464;">${title}</h2>
          ${body}
        </div>
        <div style="padding:14px 20px;background:#f5f2ee;font-size:12px;color:#6b6b6b;">
          <p style="margin:0 0 8px;">Need help? reply to hello@oddfinds.com</p>
          <a href="{{unsubscribeUrl}}" style="color:#1B1464;">Unsubscribe</a>
        </div>
      </div>
    </div>
  `;
}
