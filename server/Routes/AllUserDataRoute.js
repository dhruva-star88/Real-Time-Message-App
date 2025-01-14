import express from "express"
import { getAllUsersData } from "../Controllers/AllUserDataController.js"

const router = express.Router()

router.get("/users", getAllUsersData)

export default router