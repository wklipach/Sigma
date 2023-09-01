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

    if (req.query.get_list_check) {
      const result = await asyncGetListCheck();
      res.send(result);
    }    

    if (req.query.get_check) {
      const result = await asyncGetCheck(req.query.get_check);
      res.send(result);
    }    

    if (req.query.get_tittle_info) {
      const result = await asyncGetCheckTitleInfo(req.query.get_tittle_info);
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
                                     req.body['elements_object'], 
                                     req.body['average_grade'], 
                                     req.body['count_trouble'], 
                                     req.body['id_user']);
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



    async function asyncGetCheck(id_po_check) {
      let conn = await pool.getConnection();
      try {

        const params = [id_po_check];

        const sQuery = 
          " select gc.name, M.grade, M.`comment` "+
          " from po_checklist_composition M "+
          " left join guide_checklist gc on gc.id = M.id_check "+
          " where M.id_po_checklist=?  order by gc.id";
        
          const resQuery = await conn.query(sQuery, params);
          return JSON.stringify(resQuery);
        } catch (err) {
          return  err;
        } finally  {
            if (conn) conn.release(); 
      }        
    }

    async function asyncGetListCheck() {
      let conn = await pool.getConnection();
      try {

        const sQuery = 
        " select "+
        "   pc.id, "+
        "   pc.id_object, "+
        "   po.name, "+
        " po.address, "+
        "   pc.DateBegin, "+ 
        " pc.DateEnd, "+
        " pc.average_grade, "+
        " pc.count_trouble, "+
        " pc.id_check_senjor,"+
        " s.fio "+
        " from po_checklist pc "+
        " inner join protected_object po on po.id_object =  pc.id_object "+
        " inner join staff s on s.id_staff =  pc.id_check_senjor "+
        " order by pc.DateEnd desc ";

          const resQuery = await conn.query(sQuery);
          return JSON.stringify(resQuery);
        } catch (err) {
          return  err;
        } finally  {
            if (conn) conn.release(); 
      }        
    }



    async function asyncGetCheckTitleInfo(id_po_check) {
      let conn = await pool.getConnection();
      try {

        const params = [ id_po_check ];
        const sQuery = 
         " select  "+
         " pc.id, "+
         " pc.id_object, "+
         " po.name, "+
         " po.address, "+
         "  pc.DateBegin, "+
         " pc.DateEnd, "+
         " pc.average_grade, "+
         " pc.count_trouble, "+
         " pc.id_check_senjor, "+
         " s.fio "+
         " from po_checklist pc "+
         " inner join protected_object po on po.id_object =  pc.id_object "+
         " inner join staff s on s.id_staff =  pc.id_check_senjor "+
         " where pc.id=? ";

          const resQuery = await conn.query(sQuery, params);

          return JSON.stringify(resQuery);
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


    async function asyncInsertCheckList(id_object, dateBegin, dateEnd, id_check_senjor, elements_object, average_grade, count_trouble, id_user) {



        console.log('elements_object=', elements_object);

        let conn = await pool.getConnection();
        try {



            const mDateBegin = dateBegin.replace("Z", " ").replace("T", " ");
            const mDateEnd = dateEnd.replace("Z", " ").replace("T", " ");
  
           const params = [id_object, mDateBegin, mDateEnd, id_check_senjor, average_grade, count_trouble];
           const sInsertChecklist = 
           " insert po_checklist (id_object, dateBegin, dateEnd, id_check_senjor, average_grade, count_trouble) "+
           " value (?,?,?,?, ?, ?)";
            const resInsertChecklist = await conn.query(sInsertChecklist, params);

            if (resInsertChecklist.insertId) {
                const paramsJournal = [resInsertChecklist.insertId, id_user];
                const sJournal = 
                "insert po_checklist_log (`newvalue`, `id_checklist`, `field`, `id_user`, `date_oper`) value('insert', ?, '', ?, now())";
                await conn.query(sJournal, paramsJournal);
             
                for (let id_check in elements_object) {
                  await asyncInsertCheckListElement(resInsertChecklist.insertId, id_check, elements_object[id_check].id_grage, elements_object[id_check].comment);
                }


            }
      
            return JSON.stringify(resInsertChecklist);

          } catch (err) {
            return  err;
          } finally  {
              if (conn) conn.release(); 
        }
      }      


      async function asyncInsertCheckListElement(id_po_checklist, id_check, grade, comment) {
        let conn = await pool.getConnection();
        try {

           const sParams = [id_po_checklist, id_check, grade, comment];
           const sQuery = 
           " insert po_checklist_composition (id_po_checklist, id_check, grade, comment) "+
           " value (?,?,?,?)";
            const resInsertChecklistElement = await conn.query(sQuery, sParams);

            return JSON.stringify(resInsertChecklistElement);

          } catch (err) {
            return  err;
          } finally  {
              if (conn) conn.release(); 
        }
      }   


    module.exports = router;