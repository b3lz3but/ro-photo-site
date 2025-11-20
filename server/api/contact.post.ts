import { validateContactForm, sanitizeString, createRateLimiter } from '../utils/validation'

const rateLimiter = createRateLimiter()

export default defineEventHandler(async (event) => {
  try {
    // Get client IP for rate limiting
    const clientIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

    // Check rate limit
    if (!rateLimiter.check(clientIp)) {
      throw createError({
        statusCode: 429,
        message: 'Too many requests. Please try again later.',
      })
    }

    // Read and parse body
    const body = await readBody(event)

    // Validate form data
    const validation = validateContactForm(body)

    if (!validation.isValid) {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: { errors: validation.errors },
      })
    }

    // Sanitize input
    const sanitizedData = {
      name: sanitizeString(body.name, 100),
      email: sanitizeString(body.email, 200),
      subject: body.subject ? sanitizeString(body.subject, 200) : '',
      message: sanitizeString(body.message, 5000),
    }

    // TODO: Send email using your preferred service (e.g., Resend, SendGrid, Nodemailer)
    // For now, just log it (replace with actual email sending)
    console.log('Contact form submission:', sanitizedData)

    // In production, you would do something like:
    // await sendEmail({
    //   to: 'ciprian.radulescu85@gmail.com',
    //   subject: `Contact Form: ${sanitizedData.subject || 'No Subject'}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${sanitizedData.name}</p>
    //     <p><strong>Email:</strong> ${sanitizedData.email}</p>
    //     <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
    //   `
    // })

    return {
      success: true,
      message: 'Message sent successfully',
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
      message: 'Failed to send message. Please try again later.',
    })
  }
})
