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

    if (req.body['text'] && req.body['id_staff'] && req.body['field'] && req.body['id_user']) {
      const result = await asyncUpdateStaffObject(req.body['text'], req.body['id_staff'], req.body['field'], req.body['id_user']);
      res.send(result);
    }


    if (req.body['text_number'] && req.body['id_staff'] && req.body['field'] && req.body['id_user']) {
      const result = await asyncUpdateStaffNumber(req.body['text_number'], req.body['id_staff'], req.body['field'], req.body['id_user']);
      res.send(result);
    }

    
  
    if (req.body['itis_smallguide']) {
      const result = await asyncUpdateProtectedObjectSmallGuide
                          (req.body['id_smallguide'], req.body['text_guide'], req.body['id_staff'], req.body['field'], req.body['id_user']);
      res.send(result);
     }

     if (req.body['date'] && req.body['id_staff'] && req.body['field'] && req.body['id_user']) {
      const result = await asyncUpdateStaffDate
                          (req.body['date'], req.body['id_staff'], req.body['field'], req.body['id_user']);
      res.send(result);
     }


     if (req.body['pNull'] && req.body['id_staff'] && req.body['field'] && req.body['id_user']) {
      const result = await asyncUpdateStaffDateNull
                          (req.body['id_staff'], req.body['field'], req.body['id_user']);
      res.send(result);
     }

     if (req.body['deleteStaff']) {
      const result = await asyncDeleteStaff(req.body['id_staff'], req.body['id_user']);
      res.send(result);
     }

     if (req.body['addStaff']) {
      console.log('addStaff');
      const result = await asyncAddStaff(req.body['id_user'], req.body['text_name']);
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
            "    TIMESTAMPDIFF(YEAR, s.`DateBirth`, CURDATE()) AS sAge,"+
            "    s.`002from` as `s002from`, "+ 
            "    s.`003from` as `s003from`, "+ 
            "    s.`rank`, "+
            "    s.id_senjor_guard, "+
            "    s3.fio as senjor_guard, "+
            "    s.id_organization, "+
            "    go.`name` as `organization` "+
             "FROM staff s "+
            "join staff s3 on s3.id_staff = s.id_senjor_guard "+
            "LEFT JOIN guide_position gp on gp.id = s.id_position "+
            "LEFT JOIN guide_status gs on gs.id = s.id_status "+
            "LEFT JOIN guide_gender gg on gg.id = s.id_gender "+
            "LEFT JOIN guide_typeperson gt on gt.id = s.id_typeperson "+ 
            "left join guide_organization go on go.id = s.id_organization "+
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


  async function asyncUpdateStaffObject(text, id_staff, field, id_user) {
    let conn = await pool.getConnection();
    try {
  
        const params = [id_staff];
        const sQuery = 
        "update staff set `"+field+"`="+"'"+text+"'"+" where id_staff=?";

        const paramsJournal = [text, id_staff, field, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";

        const paramsCheck = [id_staff];
        const sCheck = 
        "select `"+field+"` from staff where id_staff=?";

        const resCheck = await conn.query(sCheck, paramsCheck);

        if (resCheck[0][field] == text) {
          return JSON.stringify(resCheck);
        } else {
          const resStaffUpdate = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resStaffUpdate);
        }

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncUpdateStaffNumber(text_number, id_staff, field, id_user) {
    let conn = await pool.getConnection();
    try {
  
        const params = [id_staff];

        let sQuery = '';

        if ((text_number == NaN) || (text_number == 'NaN')) text_number == 'null';


        if (text_number == 'null') sQuery = "update staff set `"+field+"`= null "+" where id_staff=?";
        else
                                   sQuery = "update staff set `"+field+"`="+"'"+text_number.toString()+"'"+" where id_staff=?";


        const paramsJournal = [text_number, id_staff, field, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";



        const paramsCheck = [id_staff];
        const sCheck = 
        "select `"+field+"` from staff where id_staff=?";

        const resCheck = await conn.query(sCheck, paramsCheck);


        let resText = '';
        if (resCheck[0][field] == null) resText = 'null'; else resText = resCheck[0][field];

        
        if (resText == text_number.toString()) {
          return JSON.stringify(resCheck);
        } else {
          const resStaffUpdate = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resStaffUpdate);
        }

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncUpdateStaffDate(date, id_staff, field, id_user) {
    let conn = await pool.getConnection();
    try {
 
        date = date.replace("Z", " ").replace("T", " ");

        const params = [id_staff];
        const sQuery = 
        "update staff set `"+field+"`="+"'"+date+"'"+" where id_staff=?";

        const paramsJournal = [date, id_staff, field, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";

        const paramsCheck = [id_staff];
        const sCheck = 
        "select `"+field+"` from staff where id_staff=?";

        const resCheck = await conn.query(sCheck, paramsCheck);
         // console.log('resCheck[0][field]=', resCheck[0][field]);

        if (resCheck[0][field] == date) {
          return JSON.stringify(resCheck);
        } else {

          // console.log('sQuery=', sQuery);
          const resStaffUpdate = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resStaffUpdate);
        }

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncUpdateStaffDateNull(id_staff, field, id_user) {
    let conn = await pool.getConnection();
    try {
 
        const params = [id_staff];
        const sQuery = 
        "update staff set `"+field+"`= null where id_staff=?";

        const paramsJournal = [id_staff, field, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value('', ?, ?, ?, now())";

        const paramsCheck = [id_staff];
        const sCheck = 
        "select `"+field+"` from staff where id_staff=?";

        const resCheck = await conn.query(sCheck, paramsCheck);
        // console.log('resCheck[0][field]=', resCheck[0][field]);

        if (resCheck[0][field] == '' || resCheck[0][field] == null) {
          return JSON.stringify(resCheck);
        } else {

          // console.log('sQuery=', sQuery);
          const resStaffUpdate = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resStaffUpdate);
        }

      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncDeleteStaff(id_staff, id_user) {
    let conn = await pool.getConnection();
    try {

        const params = [id_staff];
        const sQuery = 
        "update staff set bitDelete=1 where id_staff=?";

        const paramsJournal = [id_staff, id_user];
        const sJournal = 
        "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value('delete', ?, '', ?, now())";


          const resDeleteStaff = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resDeleteStaff);


      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }
  

  async function asyncAddStaff(id_user, text_name) {
    let conn = await pool.getConnection();
    try {

        const sQuery = 
        "insert staff(`fio`) "+
                " values ('" + text_name + "')"; 


         console.log('sQuery resAddStaff=', sQuery);        

        const resAddStaff = await conn.query(sQuery);

        console.log('resAddStaff=', resAddStaff);
        
        if (resAddStaff.insertId) {
          const paramsJournal = [resAddStaff.insertId, id_user];
          const sJournal = 
          "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value('insert', ?, '', ?, now())";
          await conn.query(sJournal, paramsJournal);
        }
       
          return JSON.stringify(resAddStaff);


      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  } 


  module.exports = router;





