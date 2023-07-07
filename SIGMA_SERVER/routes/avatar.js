var express = require('express');
var router = express.Router();
const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);
var fs = require('fs');


/* GET users listing. */
router.get('/', async function(req, res, next) {

    if (req.query.get_staff) {
        const result = await asyncStaff(req.query.get_staff);
        res.send(result);
      }
      
    if (req.query.clear_staff) {
        const result = await asyncClearAvatar(req.query.clear_staff);
        res.send(result);
      }      


  });

  router.post('/', async function(req, res) {

    if (req.body.avatar) {
        const result = await asyncUpdateAvatar(req.body.id_user, req.body.avatar.Name, req.body.avatar.Avatar);
        res.send(result);
    }

  });



  async function asyncStaff(id_staff) {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 'SELECT * FROM staff WHERE id_staff=?';
        const params = [id_staff];
        const resStaff = await conn.query(sQuery, params);
        return JSON.stringify(resStaff);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncUpdateAvatar(id_staff, avatar_name, Avatar) {
    let conn;
    try {

        conn = await pool.getConnection();
        let sql = "select * from staff where id_staff=?";
        const rows = await conn.query(sql, [id_staff]);
        if (rows[0]) {
            if (rows[0].avatar_name) {
            // удаляем старый аватар
                deleteOldAvatar(rows[0].avatar_name);
            }
            //создаем новое имя файла
             const sNewFileName = newName(id_staff, avatar_name);
            //сохраняем новое имя файла в базе
            if (sNewFileName) {
                const sSql = 'update staff set avatar_name=? where id_staff=?';
                const resupdate = await conn.query(sSql, [sNewFileName, id_staff]);
                // сохраняем файл на диске
                if (CreateAvatarDir()) {
                    var data = Avatar.replace('{"value":', "").replace('}', "");

                    fs.writeFile(appRoot + '/public/images/useravatar/' + sNewFileName, data, 'base64', function (err) {
                        if (err) console.log('errSaveAvatarToDisc', err);
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


function deleteOldAvatar(avatar_name) {
    const sOldFileName = appRoot + '/public/images/useravatar/' + avatar_name;
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


function newName(id_staff, avatar_name) {
    let sNewFileName = '';
    const sPrefix = new Date().getTime().toString();
    sNewFileName = id_staff.toString() + '_' + sPrefix + '.' + getFileExtension(avatar_name);
    return sNewFileName;
}

function getFileExtension(a) {
    var a = a.split('.');
    if (a.length === 1 || (a[0] === "" && a.length === 2)) {
        return '';
    }
    return a.pop();    // feel free to tack .toLowerCase() here if you want
}


function CreateAvatarDir() {
    try {
        fs.statSync(appRoot + '/public/images/useravatar/');
        console.log('file or directory exists:', appRoot + '/public/images/useravatar/');
        return true;
    }
    catch (errCreateAvatarDir) {
        if (errCreateAvatarDir.code === 'ENOENT') {
            fs.mkdir(appRoot + '/public/images/useravatar', {recursive: true}, (err) => {
                if (err) { console.log('errCreateDirAvatar', err); return false;}
                if (!err) { return true;}
            });
        } else {console.log('errCreateAvatarDir',errCreateAvatarDir); return false;}

    }
}


async function asyncClearAvatar(id_staff) {

    let conn;
    try {

        conn = await pool.getConnection();
        let sql = "select * from staff where id_staff=?";
        const rows = await conn.query(sql, [id_staff]);
        if (rows[0]) {
            if (rows[0].avatar_name) {
                // удаляем старый аватар
                deleteOldAvatar(rows[0].avatar_name);
            }

        };
        const sSql = 'update staff set avatar_name=null where id_staff=?';
        const resupdate = await conn.query(sSql, [id_staff]);

        return JSON.stringify(resupdate);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
}

  module.exports = router;