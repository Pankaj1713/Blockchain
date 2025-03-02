import { Router } from "express";
import { sendAmount, getTransactions, getTransactionDetailById } from "../controllers/transactionController.js";

const router = Router();

/**
 * @swagger
 * /transactions/transfer:
 *   post:
 *     summary: Send BTC Transaction
 *     description: Sends BTC from sender to multiple recipient addresses.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 example: "sender_wallet_address"
 *               amount:
 *                 type: number
 *                 example: 0.01
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["recipient_address_1", "recipient_address_2"]
 *     responses:
 *       200:
 *         description: Transaction successful
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.post("/transfer", sendAmount);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions with pagination
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of transactions per page
 *     responses:
 *       200:
 *         description: List of transactions
 *       500:
 *         description: Internal server error
 */
router.get("/", getTransactions);

/**
 * @swagger
 * /transactions/{trxHash}:
 *   get:
 *     summary: Get transaction details by ID
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: trxHash
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.get("/:trxHash", getTransactionDetailById);

export default router;
