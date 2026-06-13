import { contactSchema } from "../contact.validation.js";

export default async function sendContact(req, res) {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  return res.status(200).json({
    message: "Message received",
  });
}
