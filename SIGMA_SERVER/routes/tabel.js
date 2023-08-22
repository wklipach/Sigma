var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);



/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_tabel) {
      const result = await asyncTabel();
      res.send(result);
    }
 
  });


  router.post('/', async function(req, res) {

     if (req.body['dateBegin']) {
      const result = await asyncUpdateTabelDateBegin
                          (req.body['id'], req.body['dateBegin'], req.body['id_user']);
      res.send(result);
     }

     if (req.body['dateBeginNull']) {
       const result = await asyncUpdateTabelDateBeginNull
                            (req.body['id'], req.body['id_user']);
       res.send(result);
     }

     if (req.body['dateEnd']) {
        const result = await asyncUpdateTabelDateEnd
                            (req.body['id'], req.body['dateEnd'], req.body['id_user']);
        res.send(result);
       }
  
       if (req.body['dateEndNull']) {
         const result = await asyncUpdateTabelDateEndNull
                              (req.body['id'], req.body['id_user']);
         res.send(result);
       }
  
  });




  async function asyncUpdateTabelDateBegin(id, DateBegin, id_user) {
    let conn = await pool.getConnection();
    try {
        addDate = DateBegin.replace("Z", " ").replace("T", " ");

        const params = [addDate, id];
        const sQuery = 
        "update staff_object set DateBegin=? where id=?";

        console.log(sQuery, params);

        const paramsJournal = [DateBegin, id, id_user];
        const sJournal = 
        "insert tabel_log (`newvalue`, `id_tabel`, `field`, `id_user`, `date_oper`) value(?, ?, 'DateBegin', ?, now())";

        const resDateBegin = await conn.query(sQuery, params);
        await conn.query(sJournal, paramsJournal);
        return JSON.stringify(resDateBegin);

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncUpdateTabelDateBeginNull(id, id_user) {
    let conn = await pool.getConnection();
    try {
        const params = [id];
        const sQuery = 
        "update staff_object set DateBegin=null where id=?";

        console.log(sQuery, params);

        const paramsJournal = [id, id_user];
        const sJournal = 
        "insert tabel_log (`newvalue`, `id_tabel`, `field`, `id_user`, `date_oper`) value('null', ?, 'DateBegin', ?, now())";

        const resDateBegin = await conn.query(sQuery, params);
        await conn.query(sJournal, paramsJournal);
        return JSON.stringify(resDateBegin);

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncUpdateTabelDateEnd(id, DateEnd, id_user) {
    let conn = await pool.getConnection();
    try {
        addDate = DateEnd.replace("Z", " ").replace("T", " ");

        const params = [addDate, id];
        const sQuery = 
        "update staff_object set DateEnd=? where id=?";

        console.log(sQuery, params);

        const paramsJournal = [DateEnd, id, id_user];
        const sJournal = 
        "insert tabel_log (`newvalue`, `id_tabel`, `field`, `id_user`, `date_oper`) value(?, ?, 'DateEnd', ?, now())";

        const resDateEnd = await conn.query(sQuery, params);
        await conn.query(sJournal, paramsJournal);
        return JSON.stringify(resDateEnd);

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncUpdateTabelDateEndNull(id, id_user) {
    let conn = await pool.getConnection();
    try {
        const params = [id];
        const sQuery = 
        "update staff_object set DateEnd=null where id=?";

        console.log(sQuery, params);

        const paramsJournal = [id, id_user];
        const sJournal = 
        "insert tabel_log (`newvalue`, `id_tabel`, `field`, `id_user`, `date_oper`) value('null', ?, 'DateEnd', ?, now())";

        const resDateEnd = await conn.query(sQuery, params);
        await conn.query(sJournal, paramsJournal);
        return JSON.stringify(resDateEnd);

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }
  
  async function asyncTabel() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "select so.id, "+
        "so.id_object, "+
        "  so.id_staff, "+
        "  s.fio, "+
        "  po.name as object_name, "+
        "  so.DateBegin, "+
        "  so.DateEnd  "+
        "from staff_object so "+
        "left join staff s on s.id_staff = so.id_staff "+
        "left join protected_object po on po.id_object = so.id_object "+
        "order by s.fio";

        const resOne = await conn.query(sQuery);
        return JSON.stringify(resOne);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  
  }




module.exports = router;