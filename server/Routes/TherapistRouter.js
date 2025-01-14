import express from "express"
import { getSpData } from "../Controllers/UserController.js"


const router = express.Router()

router.get("/:spId", getSpData)

export default router