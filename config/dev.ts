export = {
    googleClientID: '245314736961-q8b4g24vgd0ek1i6tagdhcs21q78j22o.apps.googleusercontent.com',
    googleClientSecret: 'FCLvaFG0qTqHrAcMqxKPHbLj',
    facebookClientID: '570985869929043',
    facebookClientSecret: 'eb635e9bcc052aed50fd165bc89df6df',
    mongoURI: 'mongodb://lectiManagerUser:abc123@ds229438.mlab.com:29438/lecti-dev',
    cookieKey: 'lectiisthebestshoppingwebsiteintheworld',
    stripePublishKey: 'pk_test_8v6e5rUXIo1rEKmllTAf3IKZ',
    stripeSecretKey: 'sk_test_eHmcfB4pY5UkSabCMaZ0hzIR',
    sendGridKey: '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',
    redirectedDomain: 'http://localhost:3000/',
    viewed: process.env.VIEWED || 0.2,
    time: process.env.TIME || 0.1,
    priority: process.env.PRIORITY || 0.4,
    amount: process.env.AMOUNT || 0.3,
    attempts: process.env.ATTEMPTS || 3,
    timeIntervalRemoveNotRelevent: process.env.TimeIntervalRemoveNotRelevent || 1000 * 60 * 10,
    loadData: process.env.LOAD_DATA || true,
    groupA: process.env.GROUP_A,
    groupB: process.env.GROUP_B,
    groupC: process.env.GROUP_C
};

