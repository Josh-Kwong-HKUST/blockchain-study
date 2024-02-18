/*
block:

prev block hash
self hash
data
*/
const sha256 = require('crypto-js/sha256');
class Block {
    constructor(data, prevHash) {
        this.prevHash = prevHash;
        this.data = data;
        this.nonce = 1;
        this.hash = this.computeHash();
    }

    updateHash() {
        this.hash = this.computeHash();
    }

    computeHash() {
        return sha256(this.prevHash + this.data + this.nonce).toString();
    }

    mine(difficulty){
        while(true){
            this.updateHash();
            if(this.hash.substring(0, difficulty) !== String('0'.repeat(difficulty))){
                this.nonce++;
                this.updateHash();
                continue;
            }
            console.log('Block mined: ' + this.hash, 'Nonce: ' + this.nonce);
            break;
        }
    }
}

class Chain {
    constructor(difficulty){
        this.chain = [this.init()];
        this.difficulty = difficulty;
    }

    init(){
        const genesisBlock = new Block('This is the Genesis Block', '');
        return genesisBlock;
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(block){
        block.prevHash = this.getLatestBlock().hash;
        block.mine(this.difficulty);
        this.chain.push(block);
        if (!this.validateChain()) {
            this.chain.pop();
        }
        else {
            console.log('Block added');
        }
    }

    validateChain(){
        if (this.chain.length === 1) {
            if (this.chain[0].hash !== this.computeHash()) {
                console.log('Genesis block invalid');
                return false;
            }
            return true;
        }
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i - 1];
            if(currentBlock.hash !== currentBlock.computeHash()){
                console.log('Block ' + i + ' invalid, data might be modified');
                return false;
            }
            if(currentBlock.prevHash !== prevBlock.computeHash()){
                console.log('Chain broken between ' + i + ' and ' + (i - 1));
                return false;
            }
        }
        return true;
    }
}

const chain = new Chain(5);
chain.addBlock(new Block('This is the second block', ''));
chain.addBlock(new Block('This is the third block', ''));
console.log(chain);

// modifying
chain.chain[1].data = 'This is the second block modified';
chain.chain[1].mine(5);
chain.validateChain();