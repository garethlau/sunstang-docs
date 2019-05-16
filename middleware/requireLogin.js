module.exports = (req, res, next) => {
	// add this as the second argument to any routes that require login
	if (!req.user) {
		return res.status(401).send({error: 'You must be logged in!'})
	}
	next();
};