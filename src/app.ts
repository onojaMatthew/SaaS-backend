import express from 'express';
import cors from 'cors';
import path from "path";
import helmet from 'helmet';
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import morgan from 'morgan';
import { config } from 'dotenv';
import { router } from './routes';
import errorHandler from './middleware/error-handler';

config();


const app = express();

const swaggerJSDoc = YAML.load(path.resolve(__dirname, "../api.yaml"));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

app.use("/api_docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));
// Routes
router(app);


// Error handling
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});



export default app;