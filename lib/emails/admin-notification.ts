function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function adminNotificationSubject(email: string): string {
  return `🌱 New Tomoverde subscriber: ${email}`;
}

export function adminNotificationHtml(params: {
  email: string;
  firstName: string | null;
  surveyResponseId: string | null;
}): string {
  const { email, firstName, surveyResponseId } = params;
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>New Tomoverde subscriber</title>
</head>
<body style="margin:0;padding:0;background-color:#0F1E17;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0F1E17;">
    <tr>
      <td align="center" style="padding:40px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#8FD9A8;font-weight:500;">Tomoverde · Internal</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 20px;">
              <h1 style="margin:0;font-size:26px;line-height:1.25;color:#F4EDE0;font-weight:400;letter-spacing:-0.01em;font-family:Georgia,'Times New Roman',serif;">
                🌱 New subscriber
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;">
              <p style="margin:0;font-size:15px;line-height:1.6;color:#B8C5BC;">
                Someone just joined the newsletter.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#22362B;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#B8C5BC;width:110px;vertical-align:top;">Email</td>
                        <td style="padding:6px 0;font-size:15px;color:#F4EDE0;font-weight:500;word-break:break-all;">${escapeHtml(email)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#B8C5BC;vertical-align:top;">First name</td>
                        <td style="padding:6px 0;font-size:15px;color:#F4EDE0;">${firstName ? escapeHtml(firstName) : '<span style="color:#7a8a80;">— not given —</span>'}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#B8C5BC;vertical-align:top;">Survey response</td>
                        <td style="padding:6px 0;font-size:15px;color:#F4EDE0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;">${surveyResponseId ? escapeHtml(surveyResponseId) : '<span style="color:#7a8a80;font-family:inherit;font-size:14px;">— linked to no survey —</span>'}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#B8C5BC;vertical-align:top;">Time (ET)</td>
                        <td style="padding:6px 0;font-size:15px;color:#F4EDE0;">${escapeHtml(timestamp)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 8px;">
              <a href="https://supabase.com/dashboard/project/hzocvdqpqixgwptaoevv/editor" style="display:inline-block;background-color:#2D4A3A;color:#F4EDE0;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:14px;font-weight:500;">View in Supabase →</a>
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #22362B;padding-top:20px;margin-top:32px;">
              <p style="margin:32px 0 0;font-size:12px;line-height:1.5;color:#7a8a80;">
                Sent automatically by the Tomoverde survey app. To stop these notifications, remove the admin email send in <code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#B8C5BC;">app/api/subscribe/route.ts</code>.
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

export function adminNotificationText(params: {
  email: string;
  firstName: string | null;
  surveyResponseId: string | null;
}): string {
  const { email, firstName, surveyResponseId } = params;
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `New Tomoverde subscriber

Email: ${email}
First name: ${firstName ?? "— not given —"}
Survey response: ${surveyResponseId ?? "— linked to no survey —"}
Time (ET): ${timestamp}

View in Supabase: https://supabase.com/dashboard/project/hzocvdqpqixgwptaoevv/editor`;
}
