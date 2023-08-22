// dependencies
const { hash } = require('../../helpers/utilities');
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
    console.log("requested Prperty",requestProperties )
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
          data.create('user', phone, 'userObject', (err) => {
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
  callback(200);
};

handler._user.put = (requestProperties, callback) => {};

handler._user.delete = (requestProperties, callback) => {};

module.exports = handler;
