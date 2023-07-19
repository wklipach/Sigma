var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_mtr) {
      const result = await asyncMTR();
      res.send(result);
    }

  });


  router.post('/', async function(req, res) {

    if (req.body['text'] && req.body['id_mtr'] && req.body['field'] && req.body['id_user']) {
      const result = await asyncUpdateMtrObject(req.body['text'], req.body['id_mtr'], req.body['field'], req.body['id_user']);
      res.send(result);
    }

    if (req.body['itis_smallguide']) {
      const result = await asyncUpdateProtectedObjectSmallGuide
                          (req.body['id_smallguide'], req.body['text_guide'], req.body['id_mtr'], req.body['field'], req.body['id_user']);
      res.send(result);
     }

     if (req.body['date'] && req.body['id_mtr'] && req.body['field'] && req.body['id_user']) {
      const result = await asyncUpdateMtrDate
                          (req.body['date'], req.body['id_mtr'], req.body['field'], req.body['id_user']);
      res.send(result);
     }


     if (req.body['pNull'] && req.body['id_mtr'] && req.body['field'] && req.body['id_user']) {
      const result = await asyncUpdateMtrDateNull
                          (req.body['id_mtr'], req.body['field'], req.body['id_user']);
      res.send(result);
     } 
     
     if (req.body['deleteMtr']) {
      const result = await asyncDeleteMtr(req.body['id_mtr'], req.body['id_user']);
      res.send(result);
     }

     if (req.body['addMtr']) {
      const result = await asyncAddMtr(req.body['id_user'], req.body['text_name']);
      res.send(result);
     }     

    });    
    
    
    async function asyncUpdateMtrObject(text, id_mtr, field, id_user) {
      let conn = await pool.getConnection();
      try {
    
          const params = [id_mtr];
          const sQuery = 
          "update mtr set `"+field+"`="+"'"+text+"'"+" where id_mtr=?";
  
          const paramsJournal = [text, id_mtr, field, id_user];
          const sJournal = 
          "insert mtr_log (`newvalue`, `id_mtr`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";
  
          const paramsCheck = [id_mtr];
          const sCheck = 
          "select `"+field+"` from mtr where id_mtr=?";
  
          const resCheck = await conn.query(sCheck, paramsCheck);
  
          if (resCheck[0][field] == text) {
            return JSON.stringify(resCheck);
          } else {
            const reMtrUpdate = await conn.query(sQuery, params);
            await conn.query(sJournal, paramsJournal);
            return JSON.stringify(resMtrUpdate);
          }
  
        } catch (err) {
          return  err;
        } finally  {
            if (conn) conn.release(); 
      }
    }    



  async function asyncMTR() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
                "SELECT m.id_mtr, "+
                "m.`name`, "+
                "      m.`id_mtrvid`, "+
                "      mtrvid.name as `mtrvid`, "+
                "m.id_mtrcolor, "+
                "c.name as mtrcolor, " +
                "m.`status`, "+
                "m.`description`, "+ 
                "m.`property`, "+
                "m.`equipment`, "+
                "m.`price`, "+
                "m.`size`, "+
                "m.`count`, "+
                "m.`date_purchase`, "+
                "m.`date_issue`, "+
                "m.`tabel_number`, "+
                "m.`invent_number`, "+
                "m.`serial_number`, "+
                "m.`barcode`, "+
                "m.`invoice`, "+
                "m.`delivery_contract`, "+
                "   m.`id_organization`, "+
                "   go.`name` as `organization`, "+
                "   m.id_object, "+
                "   p.`name` as `ProtectedObject` "+
                "FROM mtr as m "+
                "left join guide_mtrvid as mtrvid on mtrvid.id=m.id_mtrvid "+
                "left join guide_organization as go on go.id=m.id_organization "+
                "left join protected_object as p on p.id_object=m.id_object "+
                "left join guide_mtrcolor as c on c.id=m.id_mtrcolor "+
                "where m.bitDelete = 0";



        const resMTR = await conn.query(sQuery);
        return JSON.stringify(resMTR);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncUpdateProtectedObjectSmallGuide(id_smallguide, text_guide, id_mtr, field, id_user) {
    let conn = await pool.getConnection();
    try {

        const params = [id_mtr];
        const sQuery = 
        "update mtr set `"+field+"`="+"'"+id_smallguide+"'"+" where id_mtr=?";

        const paramsJournal = [text_guide, id_mtr, field, id_user];
        const sJournal = 
        "insert mtr_log (`newvalue`, `id_mtr`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";

        const paramsCheck = [id_mtr];
        const sCheck = 
        "select `"+field+"` from mtr where id_mtr=?";

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


  async function asyncUpdateMtrDate(date, id_mtr, field, id_user) {
    let conn = await pool.getConnection();
    try {
 
        date = date.replace("Z", " ").replace("T", " ");

        const params = [id_mtr];
        const sQuery = 
        "update mtr set `"+field+"`="+"'"+date+"'"+" where id_mtr=?";

        const paramsJournal = [date, id_mtr, field, id_user];
        const sJournal = 
        "insert mtr_log (`newvalue`, `id_mtr`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";

        const paramsCheck = [id_mtr];
        const sCheck = 
        "select `"+field+"` from mtr where id_mtr=?";

        const resCheck = await conn.query(sCheck, paramsCheck);
         // console.log('resCheck[0][field]=', resCheck[0][field]);

        if (resCheck[0][field] == date) {
          return JSON.stringify(resCheck);
        } else {

          // console.log('sQuery=', sQuery);
          const resMtrUpdate = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resMtrUpdate);
        }

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncUpdateMtrDateNull(id_mtr, field, id_user) {
    let conn = await pool.getConnection();
    try {
 
        const params = [id_mtr];
        const sQuery = 
        "update mtr set `"+field+"`= null where id_mtr=?";

        const paramsJournal = [id_mtr, field, id_user];
        const sJournal = 
        "insert mtr_log (`newvalue`, `id_mtr`, `field`, `id_user`, `date_oper`) value('', ?, ?, ?, now())";

        const paramsCheck = [id_mtr];
        const sCheck = 
        "select `"+field+"` from mtr where id_mtr=?";

        const resCheck = await conn.query(sCheck, paramsCheck);
        // console.log('resCheck[0][field]=', resCheck[0][field]);

        if (resCheck[0][field] == '' || resCheck[0][field] == null) {
          return JSON.stringify(resCheck);
        } else {

          // console.log('sQuery=', sQuery);
          const resMtrUpdate = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resMtrUpdate);
        }

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }  

  async function asyncDeleteMtr(id_mtr, id_user) {
    let conn = await pool.getConnection();
    try {

        const params = [id_mtr];
        const sQuery = 
        "update mtr set bitDelete=1 where id_mtr=?";

        const paramsJournal = [id_mtr, id_user];
        const sJournal = 
        "insert mtr_log (`newvalue`, `id_mtr`, `field`, `id_user`, `date_oper`) value('delete', ?, '', ?, now())";


          const resDeleteMtr = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resDeleteMtr);


      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }
  

  async function asyncAddMtr(id_user, text_name) {
    let conn = await pool.getConnection();
    try {

        const sQuery = 
        "insert mtr(`name`) "+
                " values ('" + text_name + "')"; 

        const resAddMtr = await conn.query(sQuery);

        if (resAddMtr.insertId) {
          const paramsJournal = [resAddMtr.insertId, id_user];
          const sJournal = 
          "insert mtr_log (`newvalue`, `id_mtr`, `field`, `id_user`, `date_oper`) value('insert', ?, '', ?, now())";
          await conn.query(sJournal, paramsJournal);
        }
       
          return JSON.stringify(resAddMtr);


      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  } 



module.exports = router;