import express from "express";
import { sendAmount } from "../controllers/transactionController";

const router = express.Router();

router.post("/transfer", sendAmount);

export default router;
