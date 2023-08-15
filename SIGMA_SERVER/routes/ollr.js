var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);
const sqlStringOllrEdit = require("../sql_query/ollr_edit.js");     


router.get('/', async function(req, res, next) {


    if (req.query.get_ollr) {
      const result = await asyncOllr(req.query.id_staff);
      res.send(result);
    }
  });

  router.post('/', async function(req, res) {

    if (req.body['delete_ollr']) {
      const result = await asyncDeleteOllr(req.body['id_staff'], req.body['id'], req.body['id_user']);
      res.send(result);
    }

    if (req.body['close_ollr']) {
      const result = await asyncCloseOllr(req.body['id_staff'], req.body['id'], req.body['id_user']);
      res.send(result);
    }

    if (req.body['add_ollr']) {
      const result = await asyncAddOllr(req.body['id_staff'], req.body['id_ollr'], req.body['DateBegin'], req.body['id_user']);
      res.send(result);
    }



  });

  async function asyncAddOllr(id_staff, id_ollr, DateBegin, id_user) { 
    let conn = await pool.getConnection();
    try {


        addDate = DateBegin.replace("Z", " ").replace("T", " ");

        const params = [id_ollr, id_staff, addDate];
        const sQuery = 
        "insert staff_ollr (id_ollr, id_staff, DateBegin) value (?,?,?)";

        console.log(sQuery, params);


        const paramsJournal = [id_staff, id_ollr, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value('add ollr', ?, ?, ?, now())";

        const resAddOllr = await conn.query(sQuery, params);
        await conn.query(sJournal, paramsJournal);
        return JSON.stringify(resAddOllr);

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncDeleteOllr(id_staff, id, id_user) { 
    let conn = await pool.getConnection();
    try {

        const params = [id];
        const sQuery = 
        "update staff_ollr set bitDelete=1 where id=?";

        const paramsJournal = [id_staff, id, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value('delete ollr', ?, ?, ?, now())";

        const resDeleteOllr = await conn.query(sQuery, params);
        await conn.query(sJournal, paramsJournal);
        return JSON.stringify(resDeleteOllr);

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncCloseOllr(id_staff, id, id_user) { 
    let conn = await pool.getConnection();
    try {

        const params = [id];
        const sQuery = 
        "update staff_ollr set bitClose=1 where id=?";

        const paramsJournal = [id_staff, id, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value('close ollr', ?, ?, ?, now())";

        const resCloseOllr = await conn.query(sQuery, params);
        await conn.query(sJournal, paramsJournal);
        return JSON.stringify(resCloseOllr);

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }



  async function asyncOllr(id_staff) {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = sqlStringOllrEdit;
        params= [id_staff];
        const resMTR = await conn.query(sQuery, params);
        return JSON.stringify(resMTR);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }



  // return this.http.post(sUrl, {delete_ollr: 'delete_ollr', id_staff, id_ollr, id_user});
  // return this.http.post(sUrl, {close_ollr: 'close_ollr', id_staff, id_ollr, id_user});
module.exports = router;