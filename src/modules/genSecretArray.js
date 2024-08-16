const crypto = require("crypto")

function generateRandomHash() {
    const randomBytes = crypto.randomBytes(32); // 32 bytes para SHA-256
    const hash = crypto.createHash('sha256').update(randomBytes).digest('hex');
    return hash;
  }

function createSecretArray(){
    const secretList = []
    while(secretList.length < 7){
        secretList.push(generateRandomHash())
    }
    return secretList
}

module.exports = createSecretArray