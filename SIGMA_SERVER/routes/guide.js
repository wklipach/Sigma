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


    if (req.query.get_ollr_guide) {
      const result = await asyncOllrGuide();
      res.send(result);
    }


    if (req.query.get_senjor_guard) {
      const result = await asyncGuideSenjorGuard();
      res.send(result);
    }


    // для справочника - тут есть строка номер один
    if (req.query.get_protected_object) {
      const result = await asyncGuideProtectedObject();
      res.send(result);
    }

    if (req.query.get_guide_checklist) {
      const result = await asyncCheckListGuide();
      res.send(result);
    }

    if (req.query.get_guide_dress) {
      const result = await asyncGuideDress();
      res.send(result);
    }

    if (req.query.get_special_means) {
      const result = await asyncGuideSpecialMeans();
      res.send(result);
    }

    if (req.query.get_weapons) {
      const result = await asyncGuideWeapons();
      res.send(result);
    }



  });

  async function asyncGuideWeapons() {
    let conn = await pool.getConnection();
    try {

        const sQuery = 
        " select id_mtr, name, description from mtr where id_mtrvid=6 and bitDelete=0 order by name asc ";
        const resOllr = await conn.query(sQuery);
        return JSON.stringify(resOllr);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  } 

  
  async function asyncGuideSpecialMeans() {
    let conn = await pool.getConnection();
    try {

        const sQuery = 
        " select id_mtr, name, description from mtr where id_mtrvid=7 and bitDelete=0 order by name asc ";
        const resOllr = await conn.query(sQuery);
        return JSON.stringify(resOllr);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  } 

  
  async function asyncGuideDress() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        " select 0 as id_mtr, '--' as name, '' as description "+
        " union all "+
        " select id_mtr, name, description from mtr where id_mtrvid=1 and bitDelete=0 order by name asc ";
        const resOllr = await conn.query(sQuery);
        return JSON.stringify(resOllr);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  } 





  async function asyncCheckListGuide() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "SELECT id, name, trim(ifnull(comment,'')) as comment, grade, input FROM guide_checklist where bitDelete=0 order by id asc";
        const resOllr = await conn.query(sQuery);
        return JSON.stringify(resOllr);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  } 

  async function asyncOllrGuide() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "SELECT `id_ollr`, `name`, `period` FROM  guide_ollr where bitDelete = 0 order by `name` asc";
        const resOllr = await conn.query(sQuery);
        return JSON.stringify(resOllr);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  } 


  async function asyncSmallGuide(sGuide) {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "SELECT `id`, `name` FROM "+ sGuide+" where bitDelete = 0 order by `name` asc";

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
        "WHERE s.id_staff=gn.id_staff and  gn.bitDelete = 0 order by s.`fio` asc";
        const resSenjorGuard = await conn.query(sQuery);
        return JSON.stringify(resSenjorGuard);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }



  async function asyncGuideProtectedObject() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "select id_object as `id`, `name` from protected_object where (bitDelete = 0 and `name`<>'--') or id_object=1 "+
        "order by `name` asc ";

        const resProtectedObject = await conn.query(sQuery);
        return JSON.stringify(resProtectedObject);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


module.exports = router;