function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function welcomeEmailHtml(firstName?: string): string {
  const greeting = firstName ? `Hey ${escapeHtml(firstName)},` : "Hey friend,";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Welcome to Tomoverde</title>
</head>
<body style="margin:0;padding:0;background-color:#0F1E17;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0F1E17;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:13px;letter-spacing:0.22em;text-transform:uppercase;color:#8FD9A8;font-weight:500;">Tomoverde</p>
              <p style="margin:6px 0 0;font-size:14px;color:#B8C5BC;font-style:italic;">Where connection grows.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 28px;">
              <h1 style="margin:0;font-size:32px;line-height:1.2;color:#F4EDE0;font-weight:400;letter-spacing:-0.02em;font-family:Georgia,'Times New Roman',serif;">
                You're in. Welcome to Tomoverde.
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 20px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#F4EDE0;">
                ${greeting}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 20px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#F4EDE0;">
                <em>Tomo</em> means friendship. <em>Verde</em> means green. We're building the cannabis community New Jersey deserves &mdash; one where connection matters more than the transaction.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 12px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#F4EDE0;">
                Here's what we'll send you:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:8px 0;font-size:16px;line-height:1.6;color:#F4EDE0;">
                    &mdash; <strong>Events &amp; experiences</strong> worth your time. Curated, not a firehose.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:16px;line-height:1.6;color:#F4EDE0;">
                    &mdash; <strong>Venues</strong> doing cannabis-friendly right &mdash; the spots locals actually love.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:16px;line-height:1.6;color:#F4EDE0;">
                    &mdash; <strong>How cannabis is moving forward</strong> &mdash; policy, advocacy, and the stories behind the culture.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#F4EDE0;">
                One note a month. Sometimes two if something real is happening. Never more.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:3px solid #8FD9A8;">
                <tr>
                  <td style="padding:0 0 0 20px;">
                    <p style="margin:0;font-size:16px;line-height:1.6;color:#F4EDE0;">
                      <strong>One favor:</strong> hit reply and tell us what kind of event you'd actually show up to. We read every response, and the early community shapes everything that comes next.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 6px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#F4EDE0;">
                Welcome home,
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 48px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#F4EDE0;font-family:Georgia,'Times New Roman',serif;font-style:italic;">
                &mdash; Tomoverde team
              </p>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #22362B;padding-top:24px;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#B8C5BC;">
                Tomoverde &middot; Where connection grows &middot; New Jersey
              </p>
              <p style="margin:10px 0 0;font-size:13px;line-height:1.5;color:#B8C5BC;">
                You're getting this because you joined the Tomoverde community. Don't want these? <a href="{{RESEND_UNSUBSCRIBE_URL}}" style="color:#8FD9A8;text-decoration:underline;">Unsubscribe</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function welcomeEmailText(firstName?: string): string {
  const greeting = firstName ? `Hey ${firstName},` : "Hey friend,";
  return `${greeting}

You're in. Welcome to Tomoverde.

Tomo means friendship. Verde means green. We're building the cannabis community New Jersey deserves — one where connection matters more than the transaction.

Here's what we'll send you:

— Events & experiences worth your time. Curated, not a firehose.
— Venues doing cannabis-friendly right — the spots locals actually love.
— How cannabis is moving forward — policy, advocacy, and the stories behind the culture.

One note a month. Sometimes two if something real is happening. Never more.

One favor: hit reply and tell us what kind of event you'd actually show up to. We read every response, and the early community shapes everything that comes next.

Welcome home,
— Tomoverde team

Tomoverde · Where connection grows · New Jersey
Unsubscribe: {{RESEND_UNSUBSCRIBE_URL}}`;
}
