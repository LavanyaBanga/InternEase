const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendContactEmail = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: email,
    to: process.env.EMAIL_USER,
    subject: `InternEase Contact: ${subject} - from ${name}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Subject:</b> ${subject}</p>
      <p><b>Message:</b> ${message}</p>
    `
  })

  res.status(200).json({ success: true, message: 'Email sent successfully' })
})

module.exports = { sendContactEmail }