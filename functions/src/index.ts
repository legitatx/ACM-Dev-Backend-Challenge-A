// Import our Express instance.
import app from "./app";
// Import Firebase functions.
import * as functions from "firebase-functions";

// Trigger Cloud Functions to run whenever an HTTPS request is made to the Exxpress instance. Any request data from the function will be passed along to Express to be handled by middleware and handlers.
export const challenge = functions.https.onRequest(app);
