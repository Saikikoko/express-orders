const crypto = require('crypto');

//返回加密函数
module.exports = function(password,key="a handsome boy"){
    const hmac = crypto.createHmac("sha256",key);
    hmac.update(password);
    const passwordHmac = hmac.digest("hex");
    return passwordHmac;
}
















