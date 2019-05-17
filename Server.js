const express =require('express');
const bodyParser = require('body-parser');
const myBlockchain = require('./simpleChain.js')();
const Block = require('./Block.js');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMsg = require('bitcoinjs-message');
const hex2ascii = require('hex2ascii');
var Buffer = require('buffer/').Buffer


const app =express();

const port= 8000;


app.use(bodyParser.json());

const mempool ={};
app.post('/requestValidation' , async (req ,res) =>{
    

    let address = req.body.address;
    let requst=mempool[address];

    if(requst){
        let time = new Date().getTime().toString().slice(0, -3);
        let timeElapsed = time - requst.requestTimeStamp;
        let newValidationWindow = 300 - timeElapsed;
        requst.validationWindow = newValidationWindow;
        mempool[address] = requst;

        return res.json(mempool[address]);
                         
       
    }else{


    const timestamp = new Date().getTime().toString().slice(0, -3);
    const message =address+':'+timestamp+':starRegistry';

   let data = {
    address : req.body.address ,
    requestTimeStamp : timestamp ,
    message : message ,
    validationWindow : 300
   }
   
   mempool[data.address]=data;
   setTimeout(() => {
    delete mempool[data.address];
}, data.validationWindow * 1000);

res.json(data);
}
  
  
});


app.post('/message-signature/validate', async (req, res) => {


    let address = req.body.address;
    signature = req.body.signature;
    let request = mempool[address];

    let isValid = bitcoinMsg.verify(request.message, address, signature);


if (isValid == true) {

let time = new Date().getTime().toString().slice(0, -3);
let timeElapsed = time - request.requestTimeStamp;
let newValidationWindow = 300 - timeElapsed;
let data = {
    registerStar: true,
    status: {
        address: address,
        requestTimeStamp: request.requestTimeStamp,
        message: request.message,
        validationWindow: newValidationWindow,
        messageSignature: true
    }
};

res.json(data);

}else{

    res.send('Signture is Not Valid')

}
});


app.post('/block', async (req, res) => {



    StarLength = req.body.star.story.length ;
    
    if (StarLength > 500 ) {
        res.send('Star story has to be less then 500 charater')
    }

    

    let address = req.body.address;
    let request = mempool[address];
    

if (request){

    let isValid = bitcoinMsg.verify(request.message, address, signature);
   
    if (isValid == true) {
        
        //when valid change ascii  to hex 
    let encodeStroy = Buffer(req.body.star.story).toString('hex');
    req.body.star.story = encodeStroy;

    //add the Block to Blockchain
    let newBlock = await myBlockchain.addBlock(new Block(req.body));

   //  newBlock not null the delete request and respones with the recent added Block
    if (newBlock) {
        delete mempool[address]; 
        res.json(newBlock)
    } else {
        res.send('Block is not added')
    }

}else {
    res.send('Signture is Not Valid')
}
}else {
    res.send('Request Cannot be sent now please validate address ')
}
});

app.get('/block/:height' , async (req , res) =>{

    let blockByHieght = await myBlockchain.getBlock(req.params.height);
    blockByHieght.body.star["storyDecoded"] = hex2ascii(blockByHieght.body.star.story);

    if(blockByHieght){
        res.json(blockByHieght)
    }else{
        res.send(' Requested height does not exists')
    }

});

app.get('/stars/address/:address' , async (req , res) =>{
    
    let blocks = await myBlockchain.getBlockByaddress(req.params.address)

    let BlockDecodedStory = [];
    for (let Block of blocks) {
        Block.body.star["storyDecoded"] = hex2ascii(Block.body.star.story);
        BlockDecodedStory.push(Block);
    } 

    if(blocks){
        res.json(blocks)
    }else{
        res.send('Requested wallet address does not exists')
    }

});


app.get('/stars/hash/:hash' , async (req , res) =>{

    let blockbyhash = await myBlockchain.getBlockByHash(req.params.hash) 
    blockbyhash.body.star["storyDecoded"] = hex2ascii(blockbyhash.body.star.story);

    if(blockbyhash){
        res.json(blockbyhash)
    }else{
        res.send('Requested hash does not exists')
    }

});




app.listen(port , () => console.log('up & running '));