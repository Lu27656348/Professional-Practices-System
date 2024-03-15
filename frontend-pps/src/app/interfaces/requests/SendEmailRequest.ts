export interface SendEmailRequest {
    emailTo: string,
    emailFrom: string,
    subject: string
    htmlContent: string
}
