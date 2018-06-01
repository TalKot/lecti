export =  {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    facebookClientID: process.env.FACEBOOK_CLIENT_ID,
    facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    mongoURI: process.env.MONGO_URI,
    stripePublishKey: process.env.STRIPE_PUBLISH_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    cookieKey: process.env.COOKIE_KEY,
    sendGridKey: process.env.SENDGRID_KEY,
    redirectedDomain : process.env.REDIRECTED_DOMIN,
    viewed:  process.env.VIEWED || 0.2,
    time:  process.env.TIME || 0.1 ,
    priority: process.env.PRIORITY || 0.4 ,
    amount: process.env.AMOUNT || 0.3,
    attempts : process.env.ATTEMPTS || 3,
    timeIntervalRemoveNotRelevent : process.env.TimeIntervalRemoveNotRelevent || 1000 * 60 * 10
};
