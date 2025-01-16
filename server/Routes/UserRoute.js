import express from "express"
import { addUser, getUserData } from "../Controllers/UserController.js"


const router = express.Router()

router.post('/add', addUser);
router.get("/:userId", getUserData)

export default router