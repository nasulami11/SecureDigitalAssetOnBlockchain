# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```


### Node JS framework 

- use express js 
```
npm install express 
```
- define app to use express also define which port to use

- use body parser middleware to parse incoming requsets
```
npm install body-parser
```

### Endpoints 

- get method  on URL http://localhost:8000/block/<<BlockHeight>>

if the height exists server will respones with the block
if doesn't exists server will respones with height does not exists


- post  method  on URL http://localhost:8000/block

if the body contains data element 
{
  "data" : "any data"
}

block will be added to the blockchain

and if body is empty respones will be block can't be null

