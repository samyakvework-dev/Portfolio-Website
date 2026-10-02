import nodemailer from 'nodemailer';
import fs from 'node:fs';
import path from 'node:path';

// Automatically load .env or .env.local if available in Node environment
function loadEnvFiles() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      try {
        if (typeof process.loadEnvFile === 'function') {
          process.loadEnvFile(fullPath);
        } else {
          // Fallback line-by-line .env parser
          const content = fs.readFileSync(fullPath, 'utf-8');
          for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
              const [key, ...rest] = trimmed.split('=');
              const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
              if (key && !process.env[key.trim()]) {
                process.env[key.trim()] = val;
              }
            }
          }
        }
      } catch {
        // Silently continue
      }
    }
  }
}

loadEnvFiles();

export interface EmailPayload {
  name: string;
  email: string;
  message: string;
  subject?: string;
  referenceId: string;
  createdAt?: string;
}

export interface MailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Generates an elegant, high-contrast HTML email matching Samyak's editorial brand.
 */
function generateHtmlTemplate(payload: EmailPayload): string {
  const { name, email, message, subject, referenceId, createdAt } = payload;
  const dateStr = createdAt ? new Date(createdAt).toUTCString() : new Date().toUTCString();
  const displaySubject = subject || `New Project Inquiry from ${name}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displaySubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F4F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #171717;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5F4F0; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E5E5E5; box-shadow: 0 10px 30px rgba(0,0,0,0.04); overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #171717; padding: 32px 36px;">
              <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #9A9185; display: block; margin-bottom: 8px;">
                PORTFOLIO ENQUIRY #${referenceId}
              </span>
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #F5F4F0; letter-spacing: -0.5px;">
                ${displaySubject}
              </h1>
            </td>
          </tr>

          <!-- Metadata Box -->
          <tr>
            <td style="padding: 32px 36px 16px 36px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAFAFA; border: 1px solid #EFEFEF; border-radius: 12px; padding: 18px 20px;">
                <tr>
                  <td style="padding: 6px 0; width: 100px; font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                    From:
                  </td>
                  <td style="padding: 6px 0; font-size: 15px; color: #171717; font-weight: 600;">
                    ${name}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                    Email:
                  </td>
                  <td style="padding: 6px 0; font-size: 15px; color: #171717;">
                    <a href="mailto:${email}" style="color: #171717; text-decoration: underline;">${email}</a>
                  </td>
                </tr>
                ${subject ? `
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                    Subject:
                  </td>
                  <td style="padding: 6px 0; font-size: 15px; color: #171717; font-weight: 500;">
                    ${subject}
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                    Reference:
                  </td>
                  <td style="padding: 6px 0; font-size: 13px; font-family: monospace; color: #171717;">
                    #${referenceId}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                    Received:
                  </td>
                  <td style="padding: 6px 0; font-size: 13px; color: #737373;">
                    ${dateStr}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 16px 36px 32px 36px;">
              <span style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; color: #737373; display: block; margin-bottom: 12px;">
                PROJECT BRIEF & MESSAGE
              </span>
              <div style="background-color: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 12px; padding: 24px; font-size: 15px; line-height: 1.7; color: #171717; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${message}</div>
            </td>
          </tr>

          <!-- Reply CTA Button -->
          <tr>
            <td style="padding: 0 36px 36px 36px;" align="center">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 10px; background-color: #171717;">
                    <a href="mailto:${email}?subject=${encodeURIComponent(`Re: ${displaySubject}`)}" style="font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; padding: 14px 28px; display: inline-block; border-radius: 10px;">
                      Reply directly to ${name} →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Info -->
          <tr>
            <td style="background-color: #FAFAFA; border-top: 1px solid #EFEFEF; padding: 20px 36px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #888888;">
                This enquiry was submitted via the contact form on <strong>Samyak Mahajan Portfolio</strong>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates an accessible plain-text version of the enquiry.
 */
function generatePlainText(payload: EmailPayload): string {
  const { name, email, message, subject, referenceId, createdAt } = payload;
  return `
========================================
NEW PORTFOLIO ENQUIRY #${referenceId}
========================================

From: ${name} <${email}>
Subject: ${subject || `New Inquiry from ${name}`}
Reference: #${referenceId}
Date: ${createdAt || new Date().toISOString()}

----------------------------------------
PROJECT BRIEF & MESSAGE:
----------------------------------------
${message}

----------------------------------------
Reply directly to: ${email}
  `.trim();
}

/**
 * Dispatch contact enquiry via Gmail SMTP
 */
export async function sendContactEmail(payload: EmailPayload): Promise<MailSendResult> {
  // Always ensure fresh environment variables
  loadEnvFiles();

  const recipientEmail = (process.env.CONTACT_RECEIVER_EMAIL || 'samyakvework@gmail.com').trim();
  const smtpUser = (process.env.SMTP_USER || process.env.GMAIL_USER || '').trim();
  const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '').trim().replace(/\s+/g, '');
  const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpSecure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === 'true' : smtpPort === 465;

  if (!smtpUser || !smtpPass) {
    const errorMsg = 'SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS (Google App Password) in your environment variables.';
    console.error(`[Mailer] Error: ${errorMsg}`);
    return {
      success: false,
      error: errorMsg
    };
  }

  const displaySubject = payload.subject || `New Portfolio Inquiry from ${payload.name} [#${payload.referenceId}]`;
  const htmlContent = generateHtmlTemplate(payload);
  const textContent = generatePlainText(payload);

  try {
    const isGmail = smtpHost.includes('gmail.com');
    const transporter = nodemailer.createTransport(
      isGmail
        ? {
            service: 'gmail',
            auth: {
              user: smtpUser,
              pass: smtpPass
            }
          }
        : {
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
              user: smtpUser,
              pass: smtpPass
            }
          }
    );

    const senderEmail = `"Portfolio Inquiry" <${smtpUser}>`;

    const info = await transporter.sendMail({
      from: senderEmail,
      to: recipientEmail,
      replyTo: `"${payload.name}" <${payload.email}>`,
      subject: displaySubject,
      text: textContent,
      html: htmlContent
    });

    console.log(`[Mailer] Email sent successfully via Gmail SMTP to ${recipientEmail} (ID: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (err: any) {
    console.error('[Mailer] Gmail SMTP dispatch error:', err);
    return {
      success: false,
      error: err.message || 'Failed to send email via Gmail SMTP'
    };
  }
}
