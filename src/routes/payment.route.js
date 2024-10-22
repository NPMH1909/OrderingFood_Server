import express from "express";
import { paymentController } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", paymentController.createOrder);
paymentRouter.post("/capture-order", paymentController.captureOrder);

export default paymentRouter;
