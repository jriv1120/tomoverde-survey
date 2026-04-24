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
<body style="margin:0;padding:0;background-color:#f2ecde;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2ecde;">
    <tr>
      <td align="center" style="padding:48px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:13px;letter-spacing:0.22em;text-transform:uppercase;color:#2e3a2a;font-weight:600;">Tomoverde</p>
              <p style="margin:6px 0 0;font-size:14px;color:#a49f94;font-style:italic;">Where connection grows.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 28px;">
              <h1 style="margin:0;font-size:32px;line-height:1.2;color:#1f1c18;font-weight:400;letter-spacing:-0.02em;font-family:Georgia,'Times New Roman',serif;">
                Welcome to Tomoverde.
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 20px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#1f1c18;">
                ${greeting}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 20px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#1f1c18;">
                Thanks for jumping in. We're early, which means your two cents actually moves the needle.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 12px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#1f1c18;">
                What to expect, once a month:
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:8px 0;font-size:16px;line-height:1.6;color:#1f1c18;">
                    &mdash; Events worth showing up to.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:16px;line-height:1.6;color:#1f1c18;">
                    &mdash; Venues that get cannabis right.
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:16px;line-height:1.6;color:#1f1c18;">
                    &mdash; What's happening on policy, in plain English.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#1f1c18;">
                Maybe twice if something worth telling you pops off. Never more.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:3px solid #2e3a2a;">
                <tr>
                  <td style="padding:0 0 0 20px;">
                    <p style="margin:0;font-size:16px;line-height:1.6;color:#1f1c18;">
                      Do us a favor: hit reply and tell us what kind of event you'd actually show up to. Real answer, one sentence, whatever. We read all of it.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 48px;">
              <p style="margin:0;font-size:17px;line-height:1.6;color:#1f1c18;font-family:Georgia,'Times New Roman',serif;font-style:italic;">
                &mdash; Tomoverde Team
              </p>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #ebe3d0;padding-top:24px;">
              <p style="margin:0;font-size:13px;line-height:1.5;color:#a49f94;">
                Tomoverde &middot; Where connection grows &middot; New Jersey
              </p>
              <p style="margin:10px 0 0;font-size:13px;line-height:1.5;color:#a49f94;">
                You're getting this because you joined the Tomoverde community. Don't want these? <a href="mailto:hello@tomoverde.com?subject=unsubscribe" style="color:#2e3a2a;text-decoration:underline;">Reply to unsubscribe</a>.
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

Welcome to Tomoverde.

Thanks for jumping in. We're early, which means your two cents actually moves the needle.

What to expect, once a month:

— Events worth showing up to.
— Venues that get cannabis right.
— What's happening on policy, in plain English.

Maybe twice if something worth telling you pops off. Never more.

Do us a favor: hit reply and tell us what kind of event you'd actually show up to. Real answer, one sentence, whatever. We read all of it.

— Tomoverde Team

Tomoverde · Where connection grows · New Jersey
Reply with "unsubscribe" to hello@tomoverde.com to stop receiving these.`;
}
