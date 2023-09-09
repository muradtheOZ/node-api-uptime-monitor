// dependencies
const {
  hash,
  parseJson,
  createRandomString,
} = require('../../helpers/utilities');
const data = require('../../lib/data');

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'put', 'post', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === 'string' &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length >= 6
      ? requestProperties.body.password
      : false;
  if (phone && password) {
    data.read('user', phone, (err, userData) => {
      if (err) {
        callback(400, {
          error: 'user not found may be path or user does not exist',
        });
      } else {
        let hashedpassword = hash(password);
        if (hashedpassword === parseJson(userData).password) {
          let tokenId = createRandomString(10);
          let expires = Date.now() + 60 * 60 * 1000;
          let tokenObject = {
            phone,
            id: tokenId,
            expires,
          };
          data.create('tokens', tokenId, tokenObject, (err2) => {
            if (!err2) {
              callback(200, tokenObject);
            } else {
              callback(500, {
                error: 'There is an error in server side',
              });
            }
          });
        } else {
          callback(400, {
            error: 'Password or phone no is not valid',
          });
        }
      }
    });
  } else {
    callback(400, {
      error: 'You have a problem in your request',
    });
  }
};

handler._token.get = (requestProperties, callback) => {
    // check the token number is valid
    const id =
        typeof requestProperties.QueryStringObject.id === 'string' &&
        requestProperties.QueryStringObject.id.trim().length === 10
          ? requestProperties.QueryStringObject.id
          : false;
      if(id){
        // find the token
        data.read('tokens',id,(err,u)=>{
          const token = {...parseJson(u)}
          if(!err && token){
           console.log(token)
           callback(200,token)

          }else{
            callback(404,{'error':'token not found'})
          }
        })

      }else{
        callback(404,{'error':'token not found'})
      }

  };

handler._token.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 10
          ? requestProperties.body.id
          : false;
    const extend =
        typeof requestProperties.body.extend === 'boolean' &&
        requestProperties.body.extend === true
          ? true
          : false;
      if(id && extend){
        // find the token
        data.read('tokens',id,(err,tokenData)=>{
          const token = {...parseJson(tokenData)}
          if(!err){
            let tokenObject = parseJson(tokenData)
            if(tokenObject.expires > Date.now() ){
              tokenObject.expires = Date.now()*60*60*1000;
              data.update('tokens',id,tokenObject,(err2)=>{
                if(!err2){
                    callback(200);
                }else{
                  callback(500,{
                    error:'there was a server side error'
                  })
                }
              })
            }else{
              callback(404,{'error':'token already expired'})
            }

          }else{
            callback(404,{'error':'token not found'})
          }
        })

      }else{
        callback(404,{'error':'wrong input'})
      }
};

handler._token.delete = (requestProperties, callback) => {

  const id =
  typeof requestProperties.body.id === 'string' &&
  requestProperties.body.id.trim().length === 10
    ? requestProperties.body.id
    : false;

    if(id){
      data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
          // delete the file
          data.delete('tokens',id,(err)=>{
            if(!err){
              callback(200,{message:'user logut done successfully'})
            }else{
              callback(500,{error:'server side error occured',err})
            }
          })
        } else {
          callback(400, {
            error:'Your porvided user does not esxist'
          });
        }
      });

    }else{
      callback(400,{error:'Your porvided user does not esxist'})
    }
};

handler._token.verify = (id,phone,callback)=>{
  data.read('tokens',id,(err,tokenData)=>{
    if(!err && tokenData){
      if(parseJson(tokenData).phone === phone && parseJson(tokenData).expires > Date.now()){
        callback(true)
      }else{
        callback(false)
      }
    }else{
      callback(false)
    }
  })
}

module.exports = handler;
