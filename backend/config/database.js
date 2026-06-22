import mongoose from 'mongoose';

const getConnectionState = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

const connectToDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('MONGODB_URI is not set. Backend will run without MongoDB.');
    return null;
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB_NAME || undefined,
    });

    console.log(`MongoDB connected: ${connection.connection.name}`);
    return connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

export { connectToDatabase, getConnectionState, isDatabaseConnected };
