
// Load the 'dotenv' package
import { dotenv } from 'dotenv'

// Configure 'dotenv' to load environment variables from a .env file
dotenv.config();
 const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
export const serviceClient = ShareServiceClient.fromConnectionString(connectionString);