var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const sqlStringSettings = require("../sql_query/query_settings.js");      


const pool = mariadb.createPool(mariadbSettings);


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_current_settings) {
      const result = await asyncCurSettings(req.query.get_current_settings);
      res.send(result);
    }

    if (req.query.get_settings_protected_object) {
      const result = await asyncCurProtectedObject(req.query.get_settings_protected_object);
      res.send(result);
    }

  });


  router.post('/', async function(req, res) {

    if (req.body['settings_delete_protected_object']) {
      const result = await asyncSettingDeleteProtectedObject(req.body['settings_delete_protected_object'], 
                                                             req.body['id_object'],
                                                             req.body['id_staff'],
                                                             req.body['id_user']);
     res.send(result);
    }

    if (req.body['settings_insert_protected_object']) {
      const result = await asyncSettingInsertProtectedObject(req.body['id_object'],
                                                             req.body['id_staff'],
                                                             req.body['id_user']);
     res.send(result);
    }

    if (req.body['settings_update_protected_object']) {
      const result = await asyncSettingUpdateProtectedObject(req.body['settings_update_protected_object'],
                                                             req.body['id_object'],
                                                             req.body['id_staff'],
                                                             req.body['id_user']);
     res.send(result);
    }

  });



  async function asyncCurSettings(id_staff) {
    let conn = await pool.getConnection();
    try {
  
        const sQuery =sqlStringSettings;
        const params = [id_staff];

        console.log(sQuery, params)

        const resStringSettings = await conn.query(sQuery, params);            

        return  JSON.stringify(resStringSettings);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncCurProtectedObject(id_staff) {
    let conn = await pool.getConnection();
    try {
  
        const sQuery =
        "select so.id, so.id_object, po.name as name_object from staff_object so "+
        "left join protected_object po on so.id_object = po.id_object "+
        "where so.id_staff=?";

        const params = [id_staff];
        console.log(sQuery, params)
        const resStringSettings = await conn.query(sQuery, params);            

        return  JSON.stringify(resStringSettings);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncSettingDeleteProtectedObject(id, id_object, id_staff, id_user) {
    let conn = await pool.getConnection();
    try {


      console.log('itis',id, id_object, id_staff, id_user);
        const sQuery = "delete from staff_object where id=?";
        const params = [id];
        const resStringSettings = await conn.query(sQuery, params);            


        const paramsJournal = [id_staff, id_object, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value('delete protected object', ?, ?, ?, now())";

        await conn.query(sJournal, paramsJournal);            

        return  JSON.stringify(resStringSettings);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncSettingInsertProtectedObject(id_object, id_staff, id_user) {
    let conn = await pool.getConnection();
    try {
        const sQuery = "insert staff_object (id_object, id_staff) value(?,?)";
        const params = [id_object, id_staff];

        const resStringSettings = await conn.query(sQuery, params);            

        const paramsJournal = [id_staff, id_object, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value('insert protected object', ?, ?, ?, now())";

        await conn.query(sJournal, paramsJournal);            

        return  JSON.stringify(resStringSettings);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncSettingUpdateProtectedObject(id, id_object, id_staff, id_user) {
    let conn = await pool.getConnection();
    try {
        const sQuery = "update staff_object set id_object=?  where id=?";
        const params = [id_object, id];
        const resStringSettings = await conn.query(sQuery, params);            


        const paramsJournal = [id_staff, id_object, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value('update protected object', ?, ?, ?, now())";

        await conn.query(sJournal, paramsJournal);            

        return  JSON.stringify(resStringSettings);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  module.exports = router;