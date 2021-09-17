// Initialize Express and middleware modules.
import express, { NextFunction } from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/messages";

// Initialize a new instance of Express.
const app = express();

// Express middleware to enable Access-Control-Allow-Origin (CORS) header. In this case, the origin is set in respect to the request origin.
app.use(cors({ origin: true }));

// Enable middleware to parse request body before request handlers.
// Enable body parser middleware to only parse JSON data matching the Content-Type `application/json` header.
app.use(express.json());

// Initialize other security + compression related middleware.
app.use(helmet());
app.use(compression());

// Initialize our routes with path `/message`.
app.use("/message", router);

// Enable middleware to handle any exceptions thrown by our CRUD functions. We log the error to the console and return a 500 status code. If any additional errors, we run our callback function to handle any additional errors.
function errorHandler(error: Error, request: any, response: any, next: NextFunction) {
  try {
    console.error(error);
    response.status(500).json({
      message: "Error encountered",
      error: error,
    });
  } catch (nextErr) {
    next(nextErr);
  }
}
app.use(errorHandler);

// Export an instance of Express for use within the respective routes file.
export default app;
