const crypto = require('crypto');

key1 = crypto.randomBytes(32).toString('hex');
key2 = crypto.randomBytes(32).toString('hex');

console.table({
    key1,
    key2
});