const checkRole = (role) => (req, res, next) => {
  const user = req.session.user;

  if (user.role != role) {
    //return res.redirect("/");
    return res
      .status(403)
      .send({ status: "error", error: `Unauthorized. You are not an ${role}` });
  }

  next();
};

module.exports = checkRole;
