const allowedOrigins: string[] = ['http://localhost:3000', 'https://melody-hub-m9rd.onrender.com', '*'];

export const corsOptions = {
  origin: (origin: string, callback: (error: Error | null, allow?: boolean) => void) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};
