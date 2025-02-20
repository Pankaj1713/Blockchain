import express from "express";
import { createUser, verifyUser, getUserDetails } from "../controllers/userController.js";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

const router = express.Router();

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create user (send OTP for verification)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Error sending OTP
 */
router.post("/create", createUser);

/**
 * @swagger
 * /users/verify:
 *   post:
 *     summary: Verify user OTP and create entry in DB
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid OTP or missing fields
 *       500:
 *         description: Error creating user
 */
router.post("/verify", verifyUser);

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Get user details by address
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: "example.com"
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching user details
 */
router.get("/:email", getUserDetails);

export default router;
