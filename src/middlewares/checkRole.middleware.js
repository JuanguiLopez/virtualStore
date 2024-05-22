const checkRole = (roles) => (req, res, next) => {
  const user = req.session.user;

  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  if (!roles.includes(user.role)) {
    //return res.redirect("/");
    return res
      .status(403)
      .send({
        status: "error",
        error: `Unauthorized. You are not an ${roles}`,
      });
  }

  next();
};

module.exports = checkRole;
