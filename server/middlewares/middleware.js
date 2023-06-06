import jwt from "jsonwebtoken";

export const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      req.user = user;
      if (req.url === "/api/users" && user.role !== "admin") {
        return res
          .status(403)
          .json("You are not allowed to access this route!");
      }

      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};
