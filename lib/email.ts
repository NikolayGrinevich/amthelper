// Email service using Resend
// Requires: RESEND_API_KEY in .env.local

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_URL = 'https://api.resend.com/emails'

export async function sendVerificationEmail(email: string, token: string) {
  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`

  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AmtHelper <noreply@amthelper.de>',
        to: email,
        subject: 'Verify your AmtHelper account',
        html: `
          <h2>Verify your email</h2>
          <p>Click the link below to verify your account:</p>
          <a href="${verifyLink}">${verifyLink}</a>
          <p>This link expires in 24 hours.</p>
        `,
      }),
    })

    const data = await response.json()
    return { success: response.ok, id: data.id }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false }
  }
}

export async function sendDeadlineReminder(email: string, documentName: string, deadline: string) {
  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AmtHelper <noreply@amthelper.de>',
        to: email,
        subject: `Erinnerung: Frist für ${documentName}`,
        html: `<h2>Deadline Erinnerung</h2><p>Für: <strong>${documentName}</strong></p><p>Frist: <strong>${deadline}</strong></p>`,
      }),
    })

    return { success: response.ok }
  } catch (error) {
    return { success: false }
  }
}
