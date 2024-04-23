import jwt from "jsonwebtoken";

const secretKey =
  "!a1w!qdasddasdsad32132@_3313231f@dvcvcxvcvcxXzXasdct4gyu67i8p0[oi5432wqwasds";
function authorization(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token is required." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
}

export default authorization;
