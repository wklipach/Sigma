var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);
var fs = require('fs');


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_protected_objects) {
      const result = await asyncProtectedObjects();
      res.send(result);
    }


    if (req.query.get_current_objects) {
      const result = await asyncCurrentObjects(req.query.get_current_objects);
      res.send(result);
    }

    if (req.query.clear_object) {
      const result = await asyncClearObject(req.query.clear_object);
      res.send(result);
    }  
    
 
  });


router.post('/', async function(req, res) {
    if (req.body['text'] && req.body['id_object'] && req.body['field'] && req.body['id_user']) {
        const result = await asyncUpdateProtectedObject(req.body['text'], req.body['id_object'], req.body['field'], req.body['id_user']);
        res.send(result);
    }

    if (req.body['itis_smallguide']) {
      const result = await asyncUpdateProtectedObjectSmallGuide
                          (req.body['id_smallguide'], req.body['text_guide'], req.body['id_object'], req.body['field'], req.body['id_user']);
      res.send(result);
     }

     if (req.body['deleteObject']) {
      const result = await asyncDeleteObject(req.body['id_object'], req.body['id_user']);
      res.send(result);
     }


     if (req.body['date'] && req.body['id_object'] && req.body['field'] && req.body['id_user']) {
      const result = await asyncUpdateProtectedObjectDate
                          (req.body['date'], req.body['id_object'], req.body['field'], req.body['id_user']);
      res.send(result);
     }


     if (req.body['pNull'] && req.body['id_object'] && req.body['field'] && req.body['id_user']) {
      const result = await asyncUpdateProtectedObjectDateNull
                          (req.body['id_object'], req.body['field'], req.body['id_user']);
      res.send(result);
     }


     if (req.body['addObject']) {
      const result = await asyncAddObject(req.body['id_user'], req.body['text_name']);
      res.send(result);
     }

     if (req.body.imageObject) {
      const result = await asyncUpdatePhotoObject(req.body.id_object, req.body.imageObject.Name, req.body.imageObject.imageObject);
      res.send(result);
     }



});





  async function asyncProtectedObjects() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        'SELECT po.id_object, po.`name`, '+
        'gps.`id` as id_post_status, '+
        'gps.`name` as post_status, '+
        '`options`, '+
        'gor.`id` as id_organization, '+
        'gor.`name` as cur_organization, '+
        'po.address, po.yandex_maps, po.google_maps, po.phone, '+
        'po.id_senjor_guard, '+
        's.fio as `senjor_guard`, '+
        'po.postwasset_date, po.withdrawal_date, '+
        'gm.`id` as id_mtr, '+
        'gm.name as MTR, '+
        'po.id_customer, '+
        'gc.name AS customer, '+
        'po.id_object_type, '+
        'got.name AS object_type '+
        ''+
        'FROM protected_object po '+
        'LEFT JOIN guide_post_status gps on gps.id = po.post_status '+
        'LEFT JOIN guide_organization gor on po.id_organization=gor.id '+
        'LEFT JOIN staff s on s.id_staff=po.id_senjor_guard '+
        'LEFT JOIN guide_mtr gm on gm.id =po.id_mtr '+
        'LEFT JOIN guide_customers gc on gc.id =po.id_customer '+
        'LEFT JOIN guide_object_type got on got.id=po.id_object_type '+
        'where po.bitDelete = 0 and po.id_object<>1 '+
        'ORDER BY po.id_object ASC';
 
        const resProtectedObjects = await conn.query(sQuery);
        return JSON.stringify(resProtectedObjects);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function  asyncCurrentObjects(id_object) {

   let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        'SELECT po.id_object, po.`name`, po.photo_name, '+
        'gps.`id` as id_post_status, '+
        'gps.`name` as post_status, '+
        '`options`, '+
        'gor.`id` as id_organization, '+
        'gor.`name` as cur_organization, '+
        'po.address, po.yandex_maps, po.google_maps, po.phone, '+
        'po.id_senjor_guard, '+
        's.fio as `senjor_guard`, '+
        'po.postwasset_date, po.withdrawal_date, '+
        'gm.`id` as id_mtr, '+
        'gm.name as MTR, '+
        'po.id_customer, '+
        'gc.name AS customer, '+
        'po.id_object_type, '+
        'got.name AS object_type '+
        ''+
        'FROM protected_object po '+
        'LEFT JOIN guide_post_status gps on gps.id = po.post_status '+
        'LEFT JOIN guide_organization gor on po.id_organization=gor.id '+
        'LEFT JOIN staff s on s.id_staff=po.id_senjor_guard '+
        'LEFT JOIN guide_mtr gm on gm.id =po.id_mtr '+
        'LEFT JOIN guide_customers gc on gc.id =po.id_customer '+
        'LEFT JOIN guide_object_type got on got.id=po.id_object_type '+
        'where po.bitDelete = 0 and po.id_object<>1 and po.id_object=? '+
        'ORDER BY po.id_object ASC';

        const params = [id_object];
 
        const resCurrentObjects = await conn.query(sQuery, params);
        return JSON.stringify(resCurrentObjects);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }





  async function asyncUpdateProtectedObject(text, id_object, field, id_user) {
    let conn = await pool.getConnection();
    try {
  
        const params = [id_object];
        const sQuery = 
        "update protected_object set `"+field+"`="+"'"+text+"'"+" where id_object=?";

        const paramsJournal = [text, id_object, field, id_user];
        const sJournal = 
        "insert protected_object_log (`newvalue`, `id_object`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";

        const paramsCheck = [id_object];
        const sCheck = 
        "select `"+field+"` from protected_object where id_object=?";

        console.log('sCheck=', sCheck);
        const resCheck = await conn.query(sCheck, paramsCheck);
        console.log('resCheck=', resCheck, 'resCheck[0]=', resCheck[0]);

        if (resCheck[0][field] == text) {
          return JSON.stringify(resCheck);
        } else {
          const resObectUpdate = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resObectUpdate);
        }

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }
  



  
  async function asyncUpdateProtectedObjectDateNull(id_object, field, id_user) {
    let conn = await pool.getConnection();
    try {
 
        const params = [id_object];
        const sQuery = 
        "update protected_object set `"+field+"`= null where id_object=?";

        const paramsJournal = [id_object, field, id_user];
        const sJournal = 
        "insert protected_object_log (`newvalue`, `id_object`, `field`, `id_user`, `date_oper`) value('', ?, ?, ?, now())";

        const paramsCheck = [id_object];
        const sCheck = 
        "select `"+field+"` from protected_object where id_object=?";

        const resCheck = await conn.query(sCheck, paramsCheck);
        // console.log('resCheck[0][field]=', resCheck[0][field]);

        if (resCheck[0][field] == '' || resCheck[0][field] == null) {
          return JSON.stringify(resCheck);
        } else {

          // console.log('sQuery=', sQuery);
          const resObectUpdate = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resObectUpdate);
        }

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  
  async function asyncUpdateProtectedObjectDate(date, id_object, field, id_user) {
    let conn = await pool.getConnection();
    try {
 
        date = date.replace("Z", " ").replace("T", " ");

        const params = [id_object];
        const sQuery = 
        "update protected_object set `"+field+"`="+"'"+date+"'"+" where id_object=?";

        const paramsJournal = [date, id_object, field, id_user];
        const sJournal = 
        "insert protected_object_log (`newvalue`, `id_object`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";

        const paramsCheck = [id_object];
        const sCheck = 
        "select `"+field+"` from protected_object where id_object=?";

        const resCheck = await conn.query(sCheck, paramsCheck);
        // console.log('resCheck[0][field]=', resCheck[0][field]);

        if (resCheck[0][field] == date) {
          return JSON.stringify(resCheck);
        } else {

          // console.log('sQuery=', sQuery);
          const resObectUpdate = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resObectUpdate);
        }

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }



  async function asyncUpdateProtectedObjectSmallGuide(id_smallguide, text_guide, id_object, field, id_user) {
    let conn = await pool.getConnection();
    try {


      console.log('text_guide');
  
        const params = [id_object];
        const sQuery = 
        "update protected_object set `"+field+"`="+"'"+id_smallguide+"'"+" where id_object=?";

        const paramsJournal = [text_guide, id_object, field, id_user];
        const sJournal = 
        "insert protected_object_log (`newvalue`, `id_object`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";

        const paramsCheck = [id_object];
        const sCheck = 
        "select `"+field+"` from protected_object where id_object=?";

        console.log('sCheck=', sCheck);
        const resCheck = await conn.query(sCheck, paramsCheck);
        console.log('resCheck=', resCheck, 'resCheck[0]=', resCheck[0]);

        if (resCheck[0][field] == text_guide) {
          return JSON.stringify(resCheck);
        } else {
          const resObectUpdate = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resObectUpdate);
        }

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncDeleteObject(id_object, id_user) {
    let conn = await pool.getConnection();
    try {

        const params = [id_object];
        const sQuery = 
        "update protected_object set bitDelete=1 where id_object=?";

        const paramsJournal = [id_object, id_user];
        const sJournal = 
        "insert protected_object_log (`newvalue`, `id_object`, `field`, `id_user`, `date_oper`) value('delete', ?, '', ?, now())";


          const resDeleteObject = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resDeleteObject);


      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }
  

  async function asyncAddObject(id_user, text_name) {
    let conn = await pool.getConnection();
    try {

        const sQuery = 
        "insert protected_object(`name`) "+
                " values ('" + text_name + "')"; 

        const resAddObject = await conn.query(sQuery);
        console.log('resAddObject=', resAddObject);
        
        if (resAddObject.insertId) {
          const paramsJournal = [resAddObject.insertId, id_user];
          const sJournal = 
          "insert protected_object_log (`newvalue`, `id_object`, `field`, `id_user`, `date_oper`) value('insert', ?, '', ?, now())";
          await conn.query(sJournal, paramsJournal);
        }
       
          return JSON.stringify(resAddObject);


      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  } 


  async function asyncClearObject(id_object) {

    let conn;
    try {

        conn = await pool.getConnection();
        let sql = "select * from protected_object where id_object=?";
        const rows = await conn.query(sql, [id_object]);
        if (rows[0]) {
            if (rows[0].photo_name) {
                // удаляем старый аватар
                deleteOldPhotoObject(rows[0].photo_name);
            }

        };
        const sSql = 'update protected_object set photo_name=null where id_object=?';
        const resupdate = await conn.query(sSql, [id_object]);

        return JSON.stringify(resupdate);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); //release to pool
    }
}


function deleteOldPhotoObject(photo_name) {
  const sOldFileName = appRoot + '/public/images/protected_object/' + photo_name;
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







async function  asyncUpdatePhotoObject(id_object, object_name, imageObject) {
  let conn;
  try {

      conn = await pool.getConnection();
      let sql = "select * from protected_object where id_object=?";
      const rows = await conn.query(sql, [id_object]);
      if (rows[0]) {
          if (rows[0].photo_name) {
          // удаляем старый аватар
            deleteOldPhotoObject(rows[0].photo_name);
          }
          //создаем новое имя файла
           const sNewFileName = newName(id_object, object_name);
          //сохраняем новое имя файла в базе
          if (sNewFileName) {
              const sSql = 'update protected_object set photo_name=? where id_object=?';
              const resupdate = await conn.query(sSql, [sNewFileName, id_object]);
              // сохраняем файл на диске
              if (CreateObjectDir()) {
                  var data = imageObject.replace('{"value":', "").replace('}', "");

                  fs.writeFile(appRoot + '/public/images/protected_object/' + sNewFileName, data, 'base64', function (err) {
                      if (err) console.log('errSaveObjectToDisc', err);
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


function newName(id_object, object_name) {
  let sNewFileName = '';
  const sPrefix = new Date().getTime().toString();
  sNewFileName = id_object.toString() + '_' + sPrefix + '.' + getFileExtension(object_name);
  return sNewFileName;
}

function getFileExtension(a) {
  var a = a.split('.');
  if (a.length === 1 || (a[0] === "" && a.length === 2)) {
      return '';
  }
  return a.pop();    // feel free to tack .toLowerCase() here if you want
}


function CreateObjectDir() {
  try {
      fs.statSync(appRoot + '/public/images/protected_object/');
      console.log('file or directory exists:', appRoot + '/public/images/protected_object/');
      return true;
  }
  catch (errCreateObjectDir) {
      if (errCreateObjectDir.code === 'ENOENT') {
          fs.mkdir(appRoot + '/public/images/protected_object', {recursive: true}, (err) => {
              if (err) { console.log('errCreateDirObject', err); return false;}
              if (!err) { return true;}
          });
      } else {console.log('errCreateObjectDir',errCreateObjectDir); return false;}

  }
}

  module.exports = router;