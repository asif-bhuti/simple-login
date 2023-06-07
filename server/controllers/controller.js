import jwt from "jsonwebtoken";

const users = [
  {
    id: "1",
    username: "john",
    password: "John0908",
    role: "admin",
  },
  {
    id: "2",
    username: "jane",
    password: "Jane0908",
    role: "user",
  },
  {
    id: "3",
    username: "mary",
    password: "Mary0908",
    role: "guest",
  },
];

let refreshTokens = [];

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, "mySecretKey", {
    expiresIn: "5s",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, "mySecretKey");
};

export const login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username === username && u.password === password;
  });
  if (user) {
    //Generate an access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({
      username: user.username,
      role: user.role,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("Username or password incorrect!");
  }
};

export const refresh = (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "mySecretKey", (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

export const logout = (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(400).json("Refresh token not provided.");
  }

  // Check if the refresh token exists in the array
  const tokenIndex = refreshTokens.indexOf(refreshToken);
  if (tokenIndex === -1) {
    return res.status(401).json("Invalid refresh token.");
  }

  // Remove the refresh token from the array
  refreshTokens.splice(tokenIndex, 1);

  res.status(200).json("You have been logged out successfully.");
};

export const deleteUser = (req, res) => {
  if (
    req.user.role === "admin" ||
    (req.user.id === req.params.userId && req.user.role === "user")
  ) {
    res.status(200).json("User has been deleted.");
  } else {
    res.status(403).json("You are not allowed to delete this user!");
  }
};
