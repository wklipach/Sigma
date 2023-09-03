var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);


router.get('/', async function(req, res, next) {

    if (req.query.clear_post) {
      const result = await asyncClearPost(req.query.clear_post);
      res.send(result);
    }

  });


  router.post('/', async function(req, res) {

     if (req.body.imagePost) {
      const result = await asyncUpdatePhotoPost(req.body.id_post, req.body.imagePost.Name, req.body.imagePost.imagePost);
      res.send(result);
     }

  });



  async function asyncClearPost(id_post) {

    let conn;
    try {

        conn = await pool.getConnection();
        let sql = "select * from posts where `id`=?";
        const rows = await conn.query(sql, [id_post]);
        if (rows[0]) {
            if (rows[0].photo_name) {
                // удаляем старый аватар
                deleteOldPhotoPost(rows[0].photo_name);
            }

        };
        const sSql = 'update posts set photo_name=null where `id`=?';
        const resupdate = await conn.query(sSql, [id_post]);

        return JSON.stringify(resupdate);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
}


function deleteOldPhotoPost(photo_name) {
  const sOldFileName = appRoot + '/public/images/posts/' + photo_name;
  fs.access(sOldFileName, fs.F_OK, (err) => {
      if (!err) {
          fs.unlink(sOldFileName, (err) => {
              if (err) console.log('ErrFileDeleted', err);
              if (!err) console.log('FileDeleted', sOldFileName);
          });
          if (err) console.error('ErrFileAccess', err);
      }
  }); // file exists
}


async function  asyncUpdatePhotoPost(id_post, post_name, imagePost) {
  let conn;
  try {

      conn = await pool.getConnection();
      let sql = "select * from posts where `id`=?";
      const rows = await conn.query(sql, [id_post]);
      if (rows[0]) {
          if (rows[0].photo_name) {
          // удаляем старый аватар
          deleteOldPhotoPost(rows[0].photo_name);
          }
          //создаем новое имя файла
           const sNewFileName = newName(id_post, post_name);
          //сохраняем новое имя файла в базе
          if (sNewFileName) {
              const sSql = 'update posts set photo_name=? where `id`=?';
              const resupdate = await conn.query(sSql, [sNewFileName, id_post]);
              // сохраняем файл на диске
              if (CreatePostsDir()) {
                  var data = imagePost.replace('{"value":', "").replace('}', "");

                  fs.writeFile(appRoot + '/public/images/posts/' + sNewFileName, data, 'base64', function (err) {
                      if (err) console.log('errSavePostToDisc', err);
                      if (!err) console.log('File saved.')
                  });
              }
              //
          }
      };
      return JSON.stringify(rows);
  } catch (err) {
      throw err;
  } finally {
      if (conn) conn.release(); //release to pool
  }
}


function newName(id_post, post_name) {
  let sNewFileName = '';
  const sPrefix = new Date().getTime().toString();
  sNewFileName = id_post.toString() + '_' + sPrefix + '.' + getFileExtension(post_name);
  return sNewFileName;
}

function getFileExtension(a) {
  var a = a.split('.');
  if (a.length === 1 || (a[0] === "" && a.length === 2)) {
      return '';
  }
  return a.pop();    // feel free to tack .toLowerCase() here if you want
}


function CreatePostsDir() {
  try {
      fs.statSync(appRoot + '/public/images/posts/');
      console.log('file or directory exists:', appRoot + '/public/images/posts/');
      return true;
  }
  catch (errCreatePostsDir) {
      if (errCreatePostsDir.code === 'ENOENT') {
          fs.mkdir(appRoot + '/public/images/posts', {recursive: true}, (err) => {
              if (err) { console.log('errCreatePostsDir', err); return false;}
              if (!err) { return true;}
          });
      } else {console.log('errCreatePostsDir',errCreatePostsDir); return false;}

  }
}  



  module.exports = router;