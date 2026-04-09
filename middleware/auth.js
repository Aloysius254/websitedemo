// Protect routes — redirect to login if not logged in
function requireLogin(req, res, next) {
  if (req.session && req.session.userId) return next();
  res.redirect('/login');
}

module.exports = { requireLogin };
