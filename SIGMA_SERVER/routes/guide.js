var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_small_guide) {
      const result = await asyncSmallGuide(req.query.get_small_guide);
      res.send(result);
    }

    if (req.query.get_senjor_guard) {
      const result = await asyncGuideSenjorGuard();
      res.send(result);
    }


    

  });

  async function asyncSmallGuide(sGuide) {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "SELECT `id`, `name` FROM "+ sGuide+" where bitDelete = 0";

        console.log('sQuery=',sQuery);
        const resPostStatus = await conn.query(sQuery);
        return JSON.stringify(resPostStatus);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncGuideSenjorGuard() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "SELECT gn.`id`, gn.`id_staff`, s.`fio` FROM guide_senjor_guard gn, staff s "+ 
        "WHERE s.id_staff=gn.id_staff and  gn.bitDelete = 0 ";
        const resSenjorGuard = await conn.query(sQuery);
        return JSON.stringify(resSenjorGuard);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


module.exports = router;