//chooses the keys set
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
}
else {
    module.exports = require('./dev');
}
//# sourceMappingURL=keys.js.map