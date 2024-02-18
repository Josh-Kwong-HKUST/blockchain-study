const sha256 = require('crypto-js/sha256');

function proofOfWork(nonce, difficulty){
    let x = 0
    while(sha256(nonce + x).toString().substring(0, 5) !== String('0'.repeat(difficulty))){
        x++
    }
    console.log(nonce + x)
    console.log(sha256(nonce + x).toString())
}

