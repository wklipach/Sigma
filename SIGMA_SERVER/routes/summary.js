var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);



/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_one_date) {
      const result = await asyncOneDate(req.query.get_one_date);
      res.send(result);
    }

    if (req.query.get_object_senjor) {
        const result = await asyncObjectSenjor(req.query.get_object_senjor);
        res.send(result);
      }

      if (req.query.get_company) {
        const result = await asyncCompany(req.query.get_company);
        res.send(result);
      }

      if (req.query.get_ollr) {
        const result = await asyncOLLR(req.query.get_ollr);
        res.send(result);
      }

 
  });


  async function asyncOneDate(id_staff) {


    let conn = await pool.getConnection();
    try {
  
        const params = [id_staff];
        const sQuery = 
        "SELECT s.fio, s.phone, s.phone2, s.id_status, gs.name as status, s.id_position, gp.name as position, s.DateBirth, "+  
               " YEAR(CURRENT_DATE()) -  YEAR(s.DateBirth) AS Age, s.id_typeperson, gtp.name typeperson "+
        "from staff s "+
        "LEFT JOIN guide_status gs ON s.id_status=gs.id_status "+
        "LEFT JOIN guide_position gp ON gp.id_position = s.id_position "+
        "LEFT JOIN guide_typeperson gtp ON gtp.id_person = s.id_typeperson "+
        "WHERE s.id_staff=?";

        const resOne = await conn.query(sQuery, params);
        return JSON.stringify(resOne);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  
  }


  async function asyncObjectSenjor(id_staff) {
    let conn = await pool.getConnection();
    try {
  
        const params = [id_staff];
        const sQuery = 
        "SELECT so.id_object, po.name AS PONAME, s.fio AS senjor  FROM staff_object so "+
        "LEFT JOIN protected_object po ON po.id_object = so.id_object "+
        "LEFT JOIN staff s ON s.id_staff = po.id_senjor_guard "+
        "WHERE so.id_staff=?";

        const resObectSenjor = await conn.query(sQuery, params);
        return JSON.stringify(resObectSenjor);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncCompany(id_staff) {
    let conn = await pool.getConnection();
    try {
  
        const params = [id_staff];
        const sQuery = 
        "SELECT so.id_organization, g.name FROM staff_organization so "+
        "LEFT JOIN guide_organization g ON g.id_organization=so.id_organization "+
        "WHERE id_staff=?";

        const resCompany = await conn.query(sQuery, params);
        return JSON.stringify(resCompany);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncOLLR(id_staff) {
    let conn = await pool.getConnection();
    try {
  
        const params = [id_staff];
        const sQuery = 
        "SELECT so.id_ollr, go.name, MOD(so.id_ollr, 2) AS bitOverdue from staff_ollr so "+
        "LEFT join guide_ollr go ON go.id_ollr=so.id_ollr "+
        "WHERE so.id_staff=? "+
        "ORDER BY go.id_ollr asc";

        const resOLLR = await conn.query(sQuery, params);
        return JSON.stringify(resOLLR);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  module.exports = router;