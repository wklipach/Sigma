var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.get_task) {
      const result = await asyncTask();
      res.send(result);
    }
 
  });

  router.post('/', async function(req, res) {

    if (req.body['insert_task']) {
      const result = await asyncInsertTask(req.body['id_object'], 
                                           req.body['id_department'], 
                                           req.body['note'], 
                                           req.body['date_begin'],
                                           req.body['date_end'],
                                           req.body['id_user']);
      res.send(result);
    }  

    if (req.body['deleteTask']) {
      const result = await asyncDeleteTask(req.body['id_task'], req.body['id_user']);
      res.send(result);
     }

     if (req.body['succesfullTask']) {
      const result = await asyncSuccesfullTask(req.body['id_task'], req.body['id_user']);
      res.send(result);
     }

});



    async function   asyncInsertTask(id_object, id_department, note, date_begin, date_end, id_user) {

        let conn = await pool.getConnection();
        try {
    
            const params = [id_object, id_department, note, date_begin, date_end, id_user];
            const sQuery = 
            "insert task (id_object, id_department, note, date_begin, date_end, id_user, DateCreate) value(?,?,?,?,?,?, now())";
            
            const resAddTask = await conn.query(sQuery, params);
            
            /*  заносим поля по одному в журнал*/
            if (resAddTask.insertId) {
                const cur_date = new Date();

                let paramsJournal = [resAddTask.insertId, id_user, cur_date];
                let sJournal = 
                "insert task_log (`id_task`, `newvalue`,  `field`, `id_user`, `date_oper`) value(?, 'insert', '', ?, ?)";
                await conn.query(sJournal, paramsJournal);

                paramsJournal = [resAddTask.insertId, id_object, 'id_object', id_user, cur_date];
                sJournal = 
                "insert task_log (`id_task`, `newvalue`,  `field`, `id_user`, `date_oper`) value(?, ?, ? , ?, ?)";
                await conn.query(sJournal, paramsJournal);


                paramsJournal = [resAddTask.insertId, id_department, 'id_department', id_user, cur_date];
                sJournal = 
                "insert task_log (`id_task`, `newvalue`,  `field`, `id_user`, `date_oper`) value(?, ?, ? , ?, ?)";
                await conn.query(sJournal, paramsJournal);


                paramsJournal = [resAddTask.insertId, note, 'note', id_user, cur_date];
                sJournal = 
                "insert task_log (`id_task`, `newvalue`,  `field`, `id_user`, `date_oper`) value(?, ?, ? , ?, ?)";
                await conn.query(sJournal, paramsJournal);

                paramsJournal = [resAddTask.insertId, date_begin, 'date_begin', id_user, cur_date];
                sJournal = 
                "insert task_log (`id_task`, `newvalue`,  `field`, `id_user`, `date_oper`) value(?, ?, ? , ?, ?)";
                await conn.query(sJournal, paramsJournal);

                paramsJournal = [resAddTask.insertId, date_end, 'date_end', id_user, cur_date];
                sJournal = 
                "insert task_log (`id_task`, `newvalue`,  `field`, `id_user`, `date_oper`) value(?, ?, ? , ?, ?)";
                await conn.query(sJournal, paramsJournal);

              }
                return JSON.stringify(resAddTask);
    
          } catch (err) {
            return  err;
          } finally  {
              if (conn) conn.release(); 
        }
    }  



  async function asyncTask() {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = 
        "select t.id as id_task, "+
        "t.id_department,  "+
        "t.note, "+
        "gd.name as department_name, "+
        "t.date_begin, "+
        "t.date_end, "+
        "t.bitSuccess "+
        "from task t, guide_department gd "+
        "where gd.id=t.id_department and "+
        "t.bitDelete = 0 "+
        "order by t.date_begin ";

        const resTask = await conn.query(sQuery);
        return JSON.stringify(resTask);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncDeleteTask(id_task, id_user) {
    let conn = await pool.getConnection();
    try {

        const params = [id_task];
        const sQuery = 
        "update task set bitDelete=1 where id=?";

        const paramsJournal = [id_task, id_user];
        const sJournal = 
        "insert task_log (`newvalue`, `id_task`, `field`, `id_user`, `date_oper`) value('delete', ?, '', ?, now())";


          const resDeleteTask = await conn.query(sQuery, params);
          await conn.query(sJournal, paramsJournal);
          return JSON.stringify(resDeleteTask);


      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  async function asyncSuccesfullTask(id_task, id_user) {
    let conn = await pool.getConnection();
    try {

        const params = [id_task];
        const sQuery = 
        "update task set bitSuccess=1 where id=?";

        const paramsJournal = [id_task, id_user];
        const sJournal = 
        "insert task_log (`newvalue`, `id_task`, `field`, `id_user`, `date_oper`) value('true', ?, 'bitSuccess', ?, now())";

        const resSuccesfullTask = await conn.query(sQuery, params);
        await conn.query(sJournal, paramsJournal);
        return JSON.stringify(resSuccesfullTask);


      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  module.exports = router;