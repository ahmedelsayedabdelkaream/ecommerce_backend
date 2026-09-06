import jwt from "jsonwebtoken";
interface Payload {
  userId: string;
  email: string;
  role: string;
}
export const generateAccessToken = (data: Payload) => {
  return jwt.sign(data, process.env.JWT_ACCESS_TOKEN || "defaultsecret", {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_TOKEN || "defaultsecret",
    {
      expiresIn: "30d",
    },
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, "somesupersecretsecret");
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, "anothersupersupersecret");
};
