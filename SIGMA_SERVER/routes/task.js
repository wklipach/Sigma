var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);

const sqlStringTask = require("../sql_query/query_task");  
const sqlStringTaskOne = require("../sql_query/task_one");     


/* GET users listing. */
router.get('/', async function(req, res, next) {

    if (req.query.get_task) {
      const result = await asyncTask(req.query.get_task);
      res.send(result);
    }

    if (req.query.get_task_one) {
      const result = await asyncTaskOne(req.query.get_task_one);
      res.send(result);
    }

 
  });

  router.post('/', async function(req, res) {

    if (req.body['insert_task']) {
      const result = await asyncInsertTask(req.body['id_object'], 
                                           req.body['id_nametask'], 
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

     if (req.body['acceptTask']) {
      const result = await asyncAcceptTask(req.body['id_task'], req.body['id_user']);
      res.send(result);
     }

     if (req.body['unAceptTaskCount']) {
      const result = await asyncCountTask(req.body['id_user']);
      res.send(result);
     }


});


async function asyncCountTask(id_user) {
  let conn = await pool.getConnection();
  try {

      const params = [id_user];
      const sQuery = 
      "select count(id) as tCount from task where id_department in "+
      " (select id_department from staff where id_staff=?) "+
      "  and bitDelete=0 and bitSuccess=0 ";

      console.log('sQuery =', sQuery, 'params=', params );

        const resCountTask = await conn.query(sQuery, params);
        return JSON.stringify(resCountTask);

    } catch (err) {
      return  err;
    } finally  {
        if (conn) conn.release(); 
  }
}


    async function   asyncInsertTask(id_object, id_name_task, id_department, note, date_begin, date_end, id_user) {

        let conn = await pool.getConnection();
        try {
    
            const params = [id_object, id_name_task, id_department, note, date_begin, date_end, id_user];
            const sQuery = 
            "insert task (id_object, id_name_task, id_department, note, date_begin, date_end, id_user, DateCreate) value(?,?,?,?,?,?,?, now())";
            
            const resAddTask = await conn.query(sQuery, params);

            console.log('resAddTask=', resAddTask);
            
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

                paramsJournal = [resAddTask.insertId, id_name_task, 'id_name_task', id_user, cur_date];
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



  async function asyncTask(id_user) {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = sqlStringTask;

        const params = [id_user, id_user, id_user];

        const resTask = await conn.query(sQuery, params);
        return JSON.stringify(resTask);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }

  async function asyncTaskOne(id_task) {
    let conn = await pool.getConnection();
    try {
  
        const sQuery = sqlStringTaskOne;
        const params = [id_task];

        const resTaskOne = await conn.query(sQuery, params);
        return JSON.stringify(resTaskOne);
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


  async function asyncAcceptTask(id_task, id_user) {
    let conn = await pool.getConnection();
    try {

        const params = [id_user, id_task];
        const sQuery = 
        "update task set id_user_accept=? where id=?";

        const paramsJournal = [id_user, id_task, id_user];
        const sJournal = 
        "insert task_log (`newvalue`, `id_task`, `field`, `id_user`, `date_oper`) value(?, ?, 'id_user_accept', ?, now())";

        console.log('a2');
        // fioAcceptor
        const paramsAcceptor = [id_user];
        const sAcceptor = 
        " select t.id,  "+
        "      case "+
        "        when s.fio is null then t.login  "+
        "        else s.fio "+
        "        end as RES  "+
        " from tUser t "+
        " left join staff s on s.id_staff=t.id "+
        " where t.id=?";

        const resSuccesfullTask = await conn.query(sQuery, params);
        await conn.query(sJournal, paramsJournal);
        const resAccessorTask = await conn.query(sAcceptor, paramsAcceptor);
        return JSON.stringify(resAccessorTask);


      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }


  module.exports = router;