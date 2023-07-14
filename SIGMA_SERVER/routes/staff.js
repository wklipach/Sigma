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
            "    s.`rank` "+
            "FROM staff s "+
            "LEFT JOIN guide_position gp on gp.id = s.id_position "+
            "LEFT JOIN guide_status gs on gs.id = s.id_status "+
            "LEFT JOIN guide_gender gg on gg.id = s.id_gender "+
            "LEFT JOIN guide_typeperson gt on gt.id = s.id_typeperson "+ 
            "WHERE s.bitDelete=0 "+ 
            "ORDER BY fio asc";
   
        const resStaffObjects = await conn.query(sQuery);
        return JSON.stringify(resStaffObjects);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  module.exports = router;





