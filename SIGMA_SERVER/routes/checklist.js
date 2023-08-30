var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);


/* GET users listing. */
router.get('/', async function(req, res, next) {

    if (req.query.get_next_number) {
      const result = await asyncNextNumber();
      res.send(result);
    }

    if (req.query.get_object_info) {
        const result = await asyncGetObjectInfo(req.query.get_object_info);
        res.send(result);
    }

  });


  router.post('/', async function(req, res) {

        if (req.body['insert_checklist']) {
                const result = await asyncInsertCheckList
                                    (req.body['id_object'], 
                                     req.body['dateBegin'], 
                                     req.body['dateEnd'], 
                                     req.body['id_check_senjor'], 
                                     req.body['id_user']);
                res.send(result);
        }

            
        if (req.body['insert_checklist_element']) {
            const result = await asyncInsertCheckListElement
                                    (req.body['id_po_checklist'], 
                                    req.body['id_check'], 
                                    req.body['grade']);
            res.send(result);
        }

    }); 
    
    
    async function asyncNextNumber() {
        let conn = await pool.getConnection();
        try {

 
           const sParams = [ mariadbSettings.database ];
           const sNextNumber = 
           "SELECT AUTO_INCREMENT as NextNumber FROM information_schema.TABLES WHERE TABLE_NAME = 'po_checklist' AND table_schema = ?";
  
            const resNextNumber = await conn.query(sNextNumber, sParams);
            return JSON.stringify(resNextNumber);
          } catch (err) {
            return  err;
          } finally  {
              if (conn) conn.release(); 
        }        
    }


    async function asyncGetObjectInfo(id_object) {
        let conn = await pool.getConnection();
        try {

           const sParams = [ id_object ];
           const sQuery = 
           "select id_object, name, address from protected_object where id_object = ?";
  
            const resQuery = await conn.query(sQuery, sParams);
            return JSON.stringify(resQuery);
          } catch (err) {
            return  err;
          } finally  {
              if (conn) conn.release(); 
        }        
    }


    async function asyncInsertCheckList(id_object, dateBegin, dateEnd, id_check_senjor, id_user) {
        let conn = await pool.getConnection();
        try {



            const mDateBegin = dateBegin.replace("Z", " ").replace("T", " ");
            const mDateEnd = dateEnd.replace("Z", " ").replace("T", " ");
  
           const params = [id_object, mDateBegin, mDateEnd, id_check_senjor];
           const sInsertChecklist = 
           " insert po_checklist (id_object, dateBegin, dateEnd, id_check_senjor) "+
           " value (?,?,?,?)";
            const resInsertChecklist = await conn.query(sInsertChecklist, params);

            if (resInsertChecklist.insertId) {
                const paramsJournal = [resInsertChecklist.insertId, id_user];
                const sJournal = 
                "insert po_checklist_log (`newvalue`, `id_checklist`, `field`, `id_user`, `date_oper`) value('insert', ?, '', ?, now())";
                await conn.query(sJournal, paramsJournal);
            }
      
            return JSON.stringify(resInsertChecklist);

          } catch (err) {
            return  err;
          } finally  {
              if (conn) conn.release(); 
        }
      }      


      async function asyncInsertCheckListElement(id_po_checklist, id_check, grade) {
        let conn = await pool.getConnection();
        try {

           const sParams = [id_po_checklist, id_check, grade];
           const sQuery = 
           " insert po_checklist_composition (id_po_checklist, id_check, grade) "+
           " value (?,?,?)";
            const resInsertChecklistElement = await conn.query(sQuery, sParams);

            return JSON.stringify(resInsertChecklistElement);

          } catch (err) {
            return  err;
          } finally  {
              if (conn) conn.release(); 
        }
      }   


    module.exports = router;