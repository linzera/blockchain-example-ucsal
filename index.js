const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previusHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previusHash = previusHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previusHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log("Block mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  createGenesisBlock() {
    return new Block(0, new Date().toString(), { name: "Genesis Block" }, "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previusHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previusHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

const infoCoin = new Blockchain();

console.log("Mining block...");
infoCoin.addBlock(
  new Block(1, new Date().toString(), {
    name: "Italo",
    to: "Jean",
    ammout: 200
  })
);

console.log("Mining block...");
infoCoin.addBlock(
  new Block(1, new Date().toString(), {
    name: "Jean",
    to: "Italo",
    ammout: 150
  })
);

console.log("BlockChain: ", JSON.stringify(infoCoin, null, 4));

//console.log("Is blockchain valid?", infoCoin.isChainValid());

//infoCoin.chain[1].data = { amount: 100 };
//infoCoin.chain[1].hash = infoCoin.chain[1].calculateHash();

//console.log("Is blockchain valid?", infoCoin.isChainValid());
