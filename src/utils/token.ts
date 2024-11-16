import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY!;

const TOKEN_EXPIRATION = 3600;

interface DecodedToken {
  userId: string;
  exp: number;
}

// ฟังก์ชันสำหรับสร้าง token
export function generateToken(userId: number): string {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION,
  };
  const payloadString = JSON.stringify(payload);
  const hash = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payloadString)
    .digest("hex");
  return Buffer.from(`${payloadString}.${hash}`).toString("base64");
}

// ฟังก์ชันสำหรับ validate token
export function validateToken(token: string): DecodedToken | null {
  try {
    const decodedToken = Buffer.from(token, "base64").toString();

    const [payloadString, hash] = decodedToken.split(".");
    const payload: DecodedToken = JSON.parse(payloadString);

    const calculatedHash = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(payloadString)
      .digest("hex");

    if (calculatedHash !== hash) {
      return null;
    }

    // if (payload.exp < Math.floor(Date.now() / 1000)) {
    //   return null;
    // }

    return payload;
  } catch (error) {
    return null;
  }
}
