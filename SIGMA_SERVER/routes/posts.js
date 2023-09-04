var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);
const sqlStringPost = require("../sql_query/post.js");


router.get('/', async function(req, res, next) {

    if (req.query.clear_post) {
      const result = await asyncClearPost(req.query.clear_post);
      res.send(result);
    }

    if (req.query.get_posts) {
        const result = await asyncGetPosts(req.query.id_object);
        res.send(result);
      }

      if (req.query.get_object_from_post) {
        const result = await asyncGetObjectFromPost(req.query.id_post);
        res.send(result);
      }

      if (req.query.get_post_base) {
        const result = await asyncGetPostBase(req.query.id_post);
        res.send(result);
      }

  

  });


  router.post('/', async function(req, res) {

     if (req.body.imagePost) {
      const result = await asyncUpdatePhotoPost(req.body.id_post, req.body.imagePost.Name, req.body.imagePost.imagePost);
      res.send(result);
     }

     if (req.body.insert_post) {
        const result = await asyncInsertPost(req.body.id_object, req.body.id_user);
        res.send(result);
       }

       if (req.body.insert_special_means) {
        const result = await asyncInsertSpecialMeans(req.body.id_post, req.body.id_mtr, req.body.boolChecked, req.body.count, req.body.id_user);
        res.send(result);
       }

  

  });


  async function asyncGetPostBase(id_post) {

    let conn;
    try {

        conn = await pool.getConnection();
        const sSql = sqlStringPost;
        const resSql = await conn.query(sSql, [id_post]);
        return JSON.stringify(resSql);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }

  }


async function asyncGetObjectFromPost(id_post) {

    let conn;
    try {

        conn = await pool.getConnection();
        const sSql = 
        "select id_object, `name`, address from protected_object where id_object in "+
                "(select id_object from  posts where id = ?)";

        const resSql = await conn.query(sSql, [id_post]);
        return JSON.stringify(resSql);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }

  }



  async function asyncGetPosts(id_object) {

    let conn;
    try {

        conn = await pool.getConnection();
        const sSql = 
                " select p.`id`, "+
                " p.`id_object`, "+
                " po.name as object_name, "+
                " po.address as object_address, "+
                " p.`name` as post_name, "+
                " p.`number` as post_number, "+
                " p.`label`, "+
                " p.`id_post_routine`, "+
                " pr.name as post_routine, "+
                " p.`TimeBegin`, "+
                " p.`TimeEnd`, "+
                " p.`DateBegin`, "+
                " p.`DateEnd`, "+
                " p.`camera_link`, "+
                " p.`id_dress`, "+
                " d.`name` as dress, "+
                " p.`photo_name` "+
                " from posts p "+
                " left join guide_post_routine pr on pr.id=p.id_post_routine "+
                " left join mtr d on d.id_mtr=p.id_dress "+
                " left join protected_object po on po.id_object = p.id_object  "+
                " where p.bitDelete = 0 and p.id_object = ? "+
                " order by id desc ";
    


        const resupdate = await conn.query(sSql, [id_object]);
        return JSON.stringify(resupdate);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }

  }


  async function asyncInsertPost(id_object, id_user) {

    let conn;
    try {

        conn = await pool.getConnection();
        const sSql = "insert posts(`id_object`) value (?)";
        const resInsert = await conn.query(sSql, [id_object]);

        if (resInsert.insertId) {
            const paramsJournal = ['insert', resInsert.insertId, id_object.toString(), id_user];
            const sJournal = 
            "insert posts_log (`newvalue`, `id_post`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";
            await conn.query(sJournal, paramsJournal);
        }

        return JSON.stringify(resInsert);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
}





async function asyncInsertSpecialMeans(id_post, id_mtr, boolChecked, count, id_user) {

    let conn;
    try {

        conn = await pool.getConnection();

        let  resSql;
        let paramsJournal = [];


        if (boolChecked) {
            const sSql = "insert post_special_means(`id_post`, `id_mtr`, `count`) value (?,?,?)";
            resSql = await conn.query(sSql, [id_post, id_mtr, count]);
            paramsJournal = ['insert_special_means count='+count, id_post, id_mtr, id_user];
            console.log("INSERT");
    
        } else {
            const sSql = "delete from  post_special_means where id_post=? and id_mtr=?";
            resSql = await conn.query(sSql, [id_post, id_mtr]);
            paramsJournal = ['delete_special_means', id_post, id_mtr, id_user];
        }

         const sJournal = "insert posts_log (`newvalue`, `id_post`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";
         await conn.query(sJournal, paramsJournal);
        

        return JSON.stringify(resSql);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
}



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