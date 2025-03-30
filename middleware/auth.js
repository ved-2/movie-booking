const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    // Store the requested URL to redirect back after login
    req.session.returnTo = req.originalUrl;
    res.redirect('/auth/login');
};

const isAdmin = (req, res, next) => {
    if (!req.session.user) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/auth/login');
    }
    
    if (req.session.user.role === 'admin') {
        return next();
    }
    
    res.status(403).render('error', {
        error: { message: 'Access Denied - Admin Only' },
        title: 'Error - Movie Booking System'
    });
};

// New middleware to prevent logged-in users from accessing auth pages
const isNotLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    res.redirect('/');
};

module.exports = {
    isLoggedIn,
    isAdmin,
    isNotLoggedIn
}; 