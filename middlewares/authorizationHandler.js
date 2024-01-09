const authorizationHandler = (validRoles) => (req, res, next) => {
  const user = req.user;

  // If user is not authenticated
  if (!user) {
    res.status(401);
    throw new Error("You are not authorized to perform this task.");
  }

  // If user is tutor and task can be performed by tutor
  if (user.user_role === "TUTOR" && validRoles.includes("TUTOR")) {
    return next();
  }

  // If user is student and task can be performed by student
  if (user.user_role === "STUDENT" && validRoles.includes("STUDENT")) {
    return next();
  }

  // If none of the conditions match
  res.status(401);
  throw new Error("You are not authorized to perform this task.");
};

module.exports = authorizationHandler;
