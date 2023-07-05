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


  module.exports = router;