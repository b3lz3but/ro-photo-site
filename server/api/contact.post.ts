import nodemailer from 'nodemailer'
import { validateContactForm, sanitizeString, createRateLimiter } from '../utils/validation'

const rateLimiter = createRateLimiter()

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.NUXT_SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.NUXT_SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.NUXT_SMTP_USER,
      pass: process.env.NUXT_SMTP_PASS,
    },
  })
}

export default defineEventHandler(async (event) => {
  try {
    // Get client IP for rate limiting
    const clientIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

    // Check rate limit
    if (!rateLimiter.check(clientIp)) {
      throw createError({
        statusCode: 429,
        message: 'Prea multe cereri. Te rugăm să încerci din nou mai târziu.',
      })
    }

    // Read and parse body
    const body = await readBody(event)

    // Validate form data
    const validation = validateContactForm(body)

    if (!validation.isValid) {
      throw createError({
        statusCode: 400,
        message: 'Validare eșuată',
        data: { errors: validation.errors },
      })
    }

    // Sanitize input
    const sanitizedData = {
      name: sanitizeString(body.name, 100),
      email: sanitizeString(body.email, 200),
      subject: body.subject ? sanitizeString(body.subject, 200) : 'Fără subiect',
      message: sanitizeString(body.message, 5000),
    }

    // Create transporter and send email
    const transporter = createTransporter()

    const mailOptions = {
      from: `"Fixed Focused Designs" <${process.env.NUXT_SMTP_USER}>`,
      to: process.env.NUXT_SMTP_USER, // Send to yourself
      replyTo: sanitizedData.email,
      subject: `[Contact Form] ${sanitizedData.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #18181b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; }
            .message-box { background: white; padding: 15px; border-radius: 4px; border: 1px solid #eee; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Mesaj Nou - Formular Contact</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nume:</div>
                <div class="value">${sanitizedData.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Subiect:</div>
                <div class="value">${sanitizedData.subject}</div>
              </div>
              <div class="field">
                <div class="label">Mesaj:</div>
                <div class="message-box">${sanitizedData.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Mesaj Nou - Formular Contact
=============================

Nume: ${sanitizedData.name}
Email: ${sanitizedData.email}
Subiect: ${sanitizedData.subject}

Mesaj:
${sanitizedData.message}
      `,
    }

    // Send the email
    await transporter.sendMail(mailOptions)

    // Also send confirmation email to the sender
    const confirmationMailOptions = {
      from: `"Fixed Focused Designs" <${process.env.NUXT_SMTP_USER}>`,
      to: sanitizedData.email,
      subject: 'Am primit mesajul tău - Fixed Focused Designs',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #18181b; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Mulțumim pentru mesaj!</h2>
            </div>
            <div class="content">
              <p>Bună ${sanitizedData.name},</p>
              <p>Am primit mesajul tău și îți voi răspunde cât mai curând posibil.</p>
              <p>De obicei răspund în câteva ore!</p>
              <br>
              <p>Cu stimă,<br>Ciprian Rădulescu<br>Fixed Focused Designs</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    await transporter.sendMail(confirmationMailOptions)

    console.log('Contact form email sent successfully to:', process.env.NUXT_SMTP_USER)

    return {
      success: true,
      message: 'Mesajul a fost trimis cu succes!',
    }
  } catch (error: any) {
    // Log error for debugging
    console.error('Contact form error:', error)

    // Return appropriate error response
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Nu am putut trimite mesajul. Te rugăm să încerci din nou.',
    })
  }
})
