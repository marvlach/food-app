import cors from "cors";

export const corsRules = cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  optionsSuccessStatus: 200,
})