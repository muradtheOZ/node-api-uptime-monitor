// dependencies
const { hash, parseJson,createRandomString } = require('../../helpers/utilities');
const data = require('../../lib/data');
const tokenHandler = require('./tokenHandler');
const {maxChecks} = require('../../helpers/environments');
const { token } = require('../../routes');

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'put', 'post', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    // validate inputs
    let protocol = typeof (requestProperties.body.protocol) === 'string' &&
   ['http','https'].indexOf(requestProperties.body.protocol)> -1
      ? requestProperties.body.protocol
      : false;

      let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

      let method = typeof (requestProperties.body.method) === 'string' && ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method)> -1
      ? requestProperties.body.method
      : false;

      let sucessCode = typeof (requestProperties.body.sucessCode) === 'object' && requestProperties.body.sucessCode instanceof Array
      ? requestProperties.body.sucessCode
      : false;

      let timeoutsecond = typeof requestProperties.body.timeoutsecond === 'number' && requestProperties.body.timeoutsecond % 1 === 0 && requestProperties.body.timeoutsecond >= 1 && requestProperties.body.timeoutsecond <= 5? requestProperties.body.timeoutsecond: false;

      if(protocol && url && method && sucessCode && timeoutsecond ){
          let token = typeof(requestProperties.headersObject.token) ==='string'?requestProperties.headersObject.token:
          false
        // lookup the user phone by using token
        data.read('tokens',token,(err,tokenData)=>{
          if(!err && tokenData){
            let userPhone = parseJson(tokenData).phone;
            data.read('user',userPhone,(err1,userData)=>{
              if(!err1 && userData){
                tokenHandler._token.verify(token,userPhone,(tokeIsValid)=>{
                  if(tokeIsValid){
                    let userObject = parseJson(userData)
                    let userChecks = typeof(userObject.checks) === 'object' && userObject.checks instanceof Array? userObject.checks: []
                    if(userChecks.length < maxChecks){
                      let checkId = createRandomString(20);
                      let checkObject = {
                        'id': checkId,
                        userPhone,
                        protocol,
                        url,
                        method,
                        sucessCode,
                        timeoutsecond,
                      }
                      // save the object

                      data.create('checks', checkId,checkObject,(err3)=>{
                        if(!err3){
                          // add check id to the user's object
                          userObject.checks = userChecks;
                          userObject.checks.push(checkId)

                          // save the data to user
                          data.update('user',userPhone,userObject,(err4)=>{
                            if(!err4){
                              callback(200,checkObject)
                            }else{
                              callback(500,{
                                error:'server side error'
                              })
                            }
                          })
                        }else{
                          callback(500,{
                            error:'There is a server side error'
                          })
                        }
                      })
                    }else{
                      callback(401,{
                        error:'Max check limit exceeded'
                      })
                    }
                  }else{
                    callback(403,{
                      error:'Authentication problem'
                    })
                  }
                })
              }else{
                callback(400,{
                  error:'Invalid user'
                })
              }
            })
          }else{
            callback(403,{
            error:'Authentication problem'
            })
          }
        })
          if(token){

          }
      }else{
        callback(400,{
            error:'There is an error in your input'
        })
      }

};

handler._check.get = (requestProperties, callback) => {
  const id =
        typeof requestProperties.QueryStringObject.id === 'string' &&
        requestProperties.QueryStringObject.id.trim().length === 20
          ? requestProperties.QueryStringObject.id
          : false;
      if(id){
        data.read('checks',id,(err,checkData)=>{
          if(!err && checkData){
            let token =
            typeof requestProperties.headersObject.token == 'string'
            ? requestProperties.headersObject.token
            : false;

            if(token){
              tokenHandler._token.verify(token,parseJson(checkData).userPhone, (isToken)=>{
                if(isToken){
                  callback(200,parseJson(checkData))
                }else{
                  callback(403,{
                    error:'Authentication error'
                  })
                }
              })
            }else{
              callback(400,{
                error:'Invalid token added'
              })
            }

          }else{
            callback(500,{
              error: 'There is a server side error'
            })
          }
        })
      }else{
        callback(400,{
          error:'There is an error in your input'
        })
      }
};

handler._check.put = (requestProperties, callback) => {};

handler._check.delete = (requestProperties, callback) => {};

module.exports = handler;
