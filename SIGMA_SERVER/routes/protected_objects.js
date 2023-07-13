var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_protected_objects) {
      const result = await asyncProtectedObjects();
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
        'where po.bitDelete = 0 '+
        'ORDER BY po.id_object ASC';
 
        const resProtectedObjects = await conn.query(sQuery);
        return JSON.stringify(resProtectedObjects);
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

        if (resCheck[0].options == text_guide) {
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

  module.exports = router;