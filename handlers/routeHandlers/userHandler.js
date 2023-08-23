// dependencies
const { hash, parseJson } = require('../../helpers/utilities');
const data = require('../../lib/data');

const handler = {};

handler.userHanlder = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'put', 'post', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._user = {};

handler._user.post = (requestProperties, callback) => {
    const firstname =
      typeof requestProperties.body.firstname === 'string' &&
      requestProperties.body.firstname.trim().length > 0
        ? requestProperties.body.firstname
        : false;

    const lastname =
      typeof requestProperties.body.lastname === 'string' &&
      requestProperties.body.lastname.trim().length > 0
        ? requestProperties.body.lastname
        : false;

    const phone =
      typeof requestProperties.body.phone === 'string' &&
      requestProperties.body.phone.trim().length === 11
        ? requestProperties.body.phone
        : false;

    const password =
      typeof requestProperties.body.password === 'string' &&
      requestProperties.body.password.trim().length > 6
        ? requestProperties.body.password
        : false;

    const tosAgreement =
      typeof requestProperties.body.tosAgreement === 'boolean'
        ? requestProperties.body.tosAgreement
        : false;

    if (firstname && lastname && phone && password && tosAgreement) {
      // make sure the user does not exist
      data.read('user', phone, (err, user) => {
        if (err) {
          // write the file
          let userObject = {
            firstname,
            lastname,
            phone,
            password: hash(password),
            tosAgreement,
          };
          data.create('user', phone, userObject, (err) => {
            if (!err) {
              callback(200, { message: 'User created' });
            } else {
              callback(500, { error: 'Could not create user!' });
            }
          });
        } else {
          callback(500, {
            erro: 'There is a problem in server side',
          });
        }
      });
    }else {
        callback(400, {
          error: 'Your input is incorrect',
        });
      }
};

handler._user.get = (requestProperties, callback) => {
  // check the phone number is valid
  const phone =
      typeof requestProperties.QueryStringObject.phone === 'string' &&
      requestProperties.QueryStringObject.phone.trim().length === 11
        ? requestProperties.QueryStringObject.phone
        : false;
    if(phone){
      // find the user
      data.read('user',phone,(err,u)=>{
        const user = {...parseJson(u)}
        if(!err && user){
         delete user.password;
         console.log(user.name)
         callback(200,user)

        }else{
          callback(404,{'error':'user not found'})
        }
      })

    }else{
      callback(404,{'error':'user not found'})
    }

};

handler._user.put = (requestProperties, callback) => {

  // check the phone no is valid or not
  const phone =
  typeof requestProperties.body.phone === 'string' &&
  requestProperties.body.phone.trim().length === 11
    ? requestProperties.body.phone
    : false;

    const firstname =
      typeof requestProperties.body.firstname === 'string' &&
      requestProperties.body.firstname.trim().length > 0
        ? requestProperties.body.firstname
        : false;

    const lastname =
      typeof requestProperties.body.lastname === 'string' &&
      requestProperties.body.lastname.trim().length > 0
        ? requestProperties.body.lastname
        : false;

    const password =
      typeof requestProperties.body.password === 'string' &&
      requestProperties.body.password.trim().length > 6
        ? requestProperties.body.password
        : false;

    if(phone){
      if(firstname || lastname || password){
          // lookup the user
          data.read('user', phone, (err, uData) => {
            const userData ={...parseJson(uData)}
            if (!err && userData) {
              // write the file
            if(firstname){
              userData.firstname = firstname
            }
            if(lastname){
              userData.lastname = lastname
            }
            if(password){
              userData.password = hash(password)
            }
              data.update('user', phone, userData, (err) => {
                if (!err) {
                  callback(200, { message: 'User Updated' });
                } else {
                  callback(500, { error: 'Could not update user!',err });
                }
              });
            } else {
              callback(400, {
                error:'You have problem in your request'
              });
            }
          });
      }else{
        callback(400,{
          error:'You have problem in your request'
        })
      }

    }else{
      callback('404',{error:'Invalid phone number'})
    }

};

handler._user.delete = (requestProperties, callback) => {
  const phone =
  typeof requestProperties.body.phone === 'string' &&
  requestProperties.body.phone.trim().length === 11
    ? requestProperties.body.phone
    : false;

    if(phone){
      data.read('user', phone, (err, uData) => {
        const userData ={...uData}
        if (!err && userData) {
          // delete the file
          data.delete('user',phone,(err)=>{
            if(!err){
              callback(200,{message:'user Deleted successfully'})
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

module.exports = handler;
