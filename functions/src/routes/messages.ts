// Import a Router interfaces from Express.
import { Router } from "express";
// Import our CRUD functions to send and receive messages.
import * as messageFunctions from "../crud/messages";

// Initialize a new Router instance from Node.
const router = Router();

// Add a POST handler for our send message CRUD function.
router.post("/send", messageFunctions.sendMessage);
// Add a GET handler for our read message CRUD function.
router.get("/read", messageFunctions.readMessage);

// Export our Express router.
export default router;
