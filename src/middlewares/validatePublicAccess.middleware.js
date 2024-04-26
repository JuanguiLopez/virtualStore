const validatePublicAccess = (req, res, next) => {
  if (req.session.user) return res.redirect("/");

  next();
};

module.exports = validatePublicAccess;
