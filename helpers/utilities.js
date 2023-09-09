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

// create random string
utilites.createRandomString = (strlength)=>{
 let length = strlength;
 length = typeof(strlength) === 'number' && strlength > 0 ? strlength :false;
 if(length){
    let possibleCharacters = 'abcedegfijklmnopqrstubwxyz1234567890';
    let output = '';
    for(let i=1; i<= length; i += 1){
        let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length))
        output += randomCharacter
    }
    return output;
 }
 return false
}
module.exports = utilites;