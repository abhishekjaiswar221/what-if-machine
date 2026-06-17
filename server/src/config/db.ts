import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/what-if-machine";
  try {
    await mongoose.connect(uri);
    console.log(`[db] connected -> ${uri}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[db] connection failed:", message);
    console.error("[db] continuing without persistence — history/caching will be disabled");
  }
}

export function isDBConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
