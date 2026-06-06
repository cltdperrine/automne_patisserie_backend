import express from "express";
import sendContact from "./controllers/send-contact.js";

const router = express.Router();

router.post("/", sendContact);

export default router;
