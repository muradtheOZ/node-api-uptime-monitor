/*
utilites
all code for utilites
*/
const crypto = require('crypto')
const utilites = {}
const environments = require('./environments')

// parse Json to object
utilites.parseJson = (jsonString)=>{
    let output = {}

    try{
        output = JSON.parse(jsonString)
    }catch{
        output ={}
    }
    return output
}

// make has string
utilites.hash = (str)=>{
    if (typeof str === 'string' && str.length > 0){
        const hash = crypto.createHmac('sha256',environments.secretKey).update(str).digest('hex')
        return hash
    }
    else{
        return false;
    }
}
module.exports = utilites;