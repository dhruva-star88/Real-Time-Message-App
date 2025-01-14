import express from "express"
import { getUserData } from "../Controllers/UserController.js"


const router = express.Router()

router.get("/:userId", getUserData)

export default router