// dependencies
const fs = require("fs");
const path = require("path");

const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, "/../.data/");

// write file
lib.create = (dir, file, data, callback) => {
  // open file for writing
  fs.open(
    lib.basedir + dir + "/" + file + ".json",
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // stringify the data
        const stringData = JSON.stringify(data);

        // write data to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                callback(false);
              } else {
                callback("Error closing the new file");
              }
            });
          } else {
            callback("Error writing to new file");
          }
        });
      } else {
        callback("There was an eroor a file may exist");
      }
    }
  );
};
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir,file,data,callback)=>{
  // file open for writing
  fs.open(lib.basedir + dir + "/" + file + '.json','r+',(err,fileDescriptor)=>{
    if(!err && fileDescriptor){
      const stringData = JSON.stringify(data)

      fs.ftruncate(fileDescriptor,(err)=>{
        if(!err){
          fs.writeFile(fileDescriptor,stringData,(err)=>{
            if(!err){
              fs.close(fileDescriptor,(err)=>{
                if(!err){
                  callback(false)
                }
                else{
                  callback('error closing file')
                }
              })
            }else{
              callback('Error writing file')
            }
          })
        }else{
          callback('error truncating file')
        }
      })

    }else{
      console.log('error updataing file, File may not exist')
    }

  })
}

// delete file
lib.delete = (dir,file,callback)=>{
  fs.unlink(lib.basedir + dir + "/" + file + '.json',(err)=>{
    if(!err){
      callback('false')
    }
    else{
      callback('Error in deleting file')
    }
  })
}

module.exports = lib;
