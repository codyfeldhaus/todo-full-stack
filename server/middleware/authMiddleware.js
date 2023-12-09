//require jsonwebtoken package
const jwt = require('jsonwebtoken');

//load and store our JWT secret key
const secretKey = process.env.JWT_SECRET;

//implement middleware for JWT authentication
//make function separately, and then pass to app.use
const authMiddleware = (req, res, next) => {
  //extract the token the "Authorization" header of the incoming request
  const token = req.headers['authorization'];

  //checks if the token exists
  if (token) {
    //if so
    //verify the token using the jsonwebtoken library's 'verify' method
    //which checks if the token is valid and not expired
    jwt.verify(token, secretKey, (err, decoded) => {
      console.log("token:", token);
      console.log("decoded:", decoded);
      //if the token verification fails (invalid, expired, etc.) send a 403 (unauthorized) status
      if (err) {
        return res.status(403).send("Unauthorized");
      }
      //if the token is valid, the 'decoded' parameter contains the payload of the JWT
      //attach the decoded payload (user info) to the request object
      //which allows for subsequent middleware or route handlers to also have access to the user info
      req.user = decoded;

      //call the next function in the middleware/route handler chain
      //this passes control to the next middleware or route handler
      next();
    })
  } else {
    //if no token provided in the headers, send a 403 "Unauthorized" response
    //this blocks the request from proceeding further if no token is present
    res.status(403).send("Unauthorized");
  }
};

//setup function to be able to be exported
module.exports = authMiddleware;