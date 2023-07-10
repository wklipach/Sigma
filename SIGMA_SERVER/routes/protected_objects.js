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
});


  async function asyncProtectedObjects() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        'SELECT po.id_object, po.`name`, '+
        'gps.`name` as post_status, '+
        'got.`name` as object_type, '+
        '`options`, '+
        'gor.`name` as cur_organization, '+
        'po.address, po.yandex_maps, po.google_maps, po.phone, '+
        's.fio as `senjor_guard`, '+
        'po.postwasset_date, po.withdrawal_date, '+
        'gm.name as MTR '+
        ''+
        'FROM protected_object po '+
        'LEFT JOIN guide_post_status gps on gps.id = po.post_status '+
        'LEFT JOIN guide_object_type got on po.id_object_type=got.id '+
        'LEFT JOIN guide_organization gor on po.id_organization=gor.id_organization '+
        'LEFT JOIN staff s on s.id_staff=po.id_senjor_guard '+
        'LEFT JOIN guide_mtr gm on gm.id_mtr =po.id_mtr '+
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

        if (resCheck[0].options == text) {
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
  


  module.exports = router;