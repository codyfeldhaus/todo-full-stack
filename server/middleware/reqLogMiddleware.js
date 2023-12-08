//middleware for logging request information

const reqLogMiddleware = (req, res, next) => {
  //Examples: req.method: get, post, put, delete, req.url: /api/users
  console.log(`${req.method} request was sent to ${req.url}`);
  console.log(req.headers)
  //next() is a function that we call to move on to the next middleware
  next();
}

module.exports = reqLogMiddleware;