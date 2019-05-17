/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const levelSandboxC =require('./levelSandbox.js');
const db = new levelSandboxC.LevelSandbox();

const Block = require('./Block.js');





class Blockchain{

  constructor(){

    
// if chain does not contain block add Genesis Block
 db.getBlocksCount().then((height)=>{
      if (height === 0){
      this.addBlock(new Block("Genesis block"))
      
      }
    })
}
  
  // Add new block
  async addBlock(newBlock){
    let chainHeight =  await db.getBlocksCount();
    let previousBlock = await  this.getBlock(chainHeight-1);

    // Block height
    newBlock.height =  chainHeight;
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // get Block height
    
    // previous block hash
    if( chainHeight>0){
      newBlock.previousBlockHash = previousBlock.hash;
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
      let keyV= newBlock.height;
    
      
    return new Promise(function(resolve, reject) {
    db.addLevelDBData(keyV,JSON.stringify(newBlock)).then((result)=>{
      resolve(JSON.parse(result))
      
    })
  })
    
    }



  // Get block height
    async getBlockHeight() {
     let heights = await db.getBlocksCount();
     
     return console.log(heights-1) ;

    
     }
    
    // get block
    getBlock(height) {
          //return await db.getLevelDBData(height) ;
          return new Promise((resolve, reject) => {
          db.getLevelDBData(height).then(result => {
            resolve(result)
            
          }) 

    })
  }


      getBlockByaddress(address) {
          //return await db.getLevelDBData(height) ;
          return new Promise((resolve, reject) => {
          db.getBlocksByAddress(address).then(result => {
            resolve(result)
            console.log(result)
            
          }) 

    })
  }

  getBlockByHash(hash) {
    //return await db.getLevelDBData(height) ;
    return new Promise((resolve, reject) => {
    db.getBlockByHash(hash).then(result => {
      resolve(result)
      
      
    }) 

})
}

    // validate block
   async  validateBlock(blockHeight){
      // get block object
      let block =await this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = ''; 
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();  
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    
  }
   // Validate blockchain
    async validateChain(){
      //let x =  this.getBlockHeight();
      let errorLog = [];
      for (var i = 0; i <  await db.getBlocksCount(); i++) {
        // validate block
        if (await !this.validateBlock(i))errorLog.push(i);
        let x= await db.getBlocksCount()
        
        if ( x-1!= i ){
        //get Blockhash
        let curBlock = await this.getBlock(i);
        let blockHash = curBlock.hash;
        //get nextBlock previousHash
        let nextBlock=await this.getBlock(i+1);
        let previousHash =nextBlock.previousBlockHash;
        // Compare
        if (blockHash!==previousHash) {
          console.log(' not valid '+i)
          errorLog.push(i);
        }else{
        console.log('valid '+i)
      }
        }
  }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }

  }









 module.exports = () => new Blockchain;