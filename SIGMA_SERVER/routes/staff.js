var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_staff) {
      const result = await asyncStaffObjects();
      res.send(result);
    }
 
  });


  router.post('/', async function(req, res) {
  
    if (req.body['itis_smallguide']) {
      const result = await asyncUpdateProtectedObjectSmallGuide
                          (req.body['id_smallguide'], req.body['text_guide'], req.body['id_staff'], req.body['field'], req.body['id_user']);
      res.send(result);
     }

  });   


  async function asyncStaffObjects() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
            "SELECT "+
            "    s.`id_staff`, "+ 
            "    s.`fio`, "+
            "    s.`phone`, "+
            "    s.`phone2`, "+
            "        s.`id_position`, "+
            "        gp.`name` as guide_position, "+
            "        s.`id_status`, "+ 
            "        gs.`name` as guide_status, "+
            "        s.`id_gender`, "+ 
            "        gg.`name` as guide_gender, "+
            "        s.`id_typeperson`, "+ 
            "        gt.`name` as guide_typeperson, "+		
            "    s.`DateBirth`, "+ 
            " TIMESTAMPDIFF(YEAR, s.`DateBirth`, CURDATE()) AS sAge,"+
            "    s.`002from` as `s002from`, "+ 
            "    s.`003from` as `s003from`, "+ 
            "    s.`rank`, "+
            "    s.id_senjor_guard, "+
            "    s3.fio as senjor_guard "+
             "FROM staff s "+
            "join staff s3 on s3.id_staff = s.id_senjor_guard "+
            "LEFT JOIN guide_position gp on gp.id = s.id_position "+
            "LEFT JOIN guide_status gs on gs.id = s.id_status "+
            "LEFT JOIN guide_gender gg on gg.id = s.id_gender "+
            "LEFT JOIN guide_typeperson gt on gt.id = s.id_typeperson "+ 
            "WHERE s.bitDelete=0 "+ 
            "ORDER BY s.id_staff asc";
   
        const resStaffObjects = await conn.query(sQuery);
        return JSON.stringify(resStaffObjects);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncUpdateProtectedObjectSmallGuide(id_smallguide, text_guide, id_staff, field, id_user) {
    let conn = await pool.getConnection();
    try {

        const params = [id_staff];
        const sQuery = 
        "update staff set `"+field+"`="+"'"+id_smallguide+"'"+" where id_staff=?";

        const paramsJournal = [text_guide, id_staff, field, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";

        const paramsCheck = [id_staff];
        const sCheck = 
        "select `"+field+"` from staff where id_staff=?";

        const resCheck = await conn.query(sCheck, paramsCheck);

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

  module.exports = router;





