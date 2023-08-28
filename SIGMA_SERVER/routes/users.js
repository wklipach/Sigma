var express = require('express');
var router = express.Router();
const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);


BigInt.prototype.toJSON = function() {  // <------------
  return this.toString();             // <--- SOLUTION
};                                      // <------------


/* GET users listing. */
router.get('/', async function(req, res, next) {

  if (req.query.get_user) {
    const result = await asyncUser(req.query.get_user);
    res.send(result);
  }

  if (req.query.get_email_user) {
    const emailUser = await asyncEmailUser(req.query.get_email_user);
    res.send(emailUser);
}

  if (req.query.get_nick_user) {
      const nickUser = await asyncNickUser(req.query.get_nick_user);
      res.send(nickUser);
  }

  if (req.query.get_user_withoutcurrentid) {
     const user_without_currentid = await asyncUserWithoutCurrentID(req.query.id_user);
     res.send(user_without_currentid);
  }

  if (req.query.get_user_avatar) {
    const user_avatar = await asyncAvatar(req.query.get_user_avatar);
    res.send(user_avatar);
 }

 if (req.query.get_count_messages) {
  const user_avatar = await asyncCountChatMessages(req.query.get_count_messages);
  res.send(user_avatar);
 }

 if (req.query.get_access_menu) {
  const user_access_menu = await asyncUserAccessMenu(req.query.get_access_menu);
  res.send(user_access_menu);
 }

 if (req.query.get_all_user) {
  const users = await asyncUserAllUser();
  res.send(users);
 }


 
});


router.post('/', async function(req, res) {
  if (req.body.newuser) {
      const result = await asyncNewUser(req.body.newuser);
      res.send(result);
  }

  if (req.body.insert_menu_access) {
    const result = await asyncAccessMenuOne(req.body.access, req.body.id_menu, req.body.id_user, req.body.log_user, req.body.RefName);
    res.send(result);
}



});


async function asyncAccessMenuOne(access, id_menu, id_user, log_user, log_field) {

  let conn = await pool.getConnection();
  try {
      const params = [id_user, id_menu];
      const resUsers = await conn.query("select id from access_staff_menu where id_staff=? and id_menu=?", params);
      console.log('resUsers', id_user, id_menu);
      console.log('resUsers=', resUsers);
      if (resUsers.length>0 && !access) {
        const params_delete = [resUsers[0].id];
        const resDelete = await conn.query("delete from access_staff_menu where id=?", params_delete);

        if (resDelete) {
            const paramsJournalDelete = ["delete access", id_user, log_field, log_user];
            const sJournalDelete = 
            "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";
            await conn.query(sJournalDelete, paramsJournalDelete);
         }


      }

      if (resUsers.length == 0 && access) {
        const params_insert = [id_menu, id_user];
        const resInsert = await conn.query("insert access_staff_menu (id_menu, id_staff) value (?,?)", params_insert);

        if (resInsert) {
          const paramsJournalInsert = ["insert access", id_user, log_field, log_user];
          const sJournalInsert = 
          "insert staff_log (`newvalue`, `id_staff`, `field`, `id_user`, `date_oper`) value(?, ?, ?, ?, now())";
          await conn.query(sJournalInsert, paramsJournalInsert);
       }


      }

      return JSON.stringify(resUsers);

  } catch (err) {
      return  err;
  } finally {
    if (conn) conn.release(); 
  }

}



async function asyncUserAllUser() {
  let conn = await pool.getConnection();
  try {
      const resUsers = await conn.query("SELECT id, login, fio FROM tuser WHERE bitdelete=0");
      return JSON.stringify(resUsers);
  } catch (err) {
      return  err;
  } finally {
    if (conn) conn.release(); 
  }
}



async function asyncEmailUser(sEmail) {
  let conn = await pool.getConnection();
  try {

      const resEmail = await conn.query("SELECT * FROM tuser WHERE email=? AND bitdelete=0", [sEmail]);

      return JSON.stringify(resEmail.length);
  } catch (err) {
      return  err;
  } finally {
    if (conn) conn.release(); 
  }
}


async function asyncNickUser(sNick) {
  let conn = await pool.getConnection();
  try {
      
      const resNick = await conn.query("SELECT * FROM tuser WHERE login=? AND bitdelete=0", [sNick]);
      return JSON.stringify(resNick.length);

  } catch (err) {
      return  err;
  } finally {
    if (conn) conn.release(); 
  }
}



async function asyncAvatar(id_user) {
  let conn = await pool.getConnection();
  try {
      
      const resAvatar = await conn.query("select avatar_name,  length(ifnull(avatar_name, '')) as ItIsAvatar from staff where id_staff=?", [id_user]);
      return JSON.stringify(resAvatar);

  } catch (err) {
      return  err;
  } finally {
    if (conn) conn.release(); 
  }
}


async function asyncCountChatMessages(id_user) {
  let conn = await pool.getConnection();
  try {
      
      const resCountChatMessages = await conn.query("select count(id_chat) as CountMessages from chat where bMarked=0 and id_user_to=?", [id_user]);
      return JSON.stringify(resCountChatMessages);

  } catch (err) {
      return  err;
  } finally {
    if (conn) conn.release(); 
  }
}





async function asyncUserWithoutCurrentID(currentID) {
  let conn = await pool.getConnection();
  try {


    const sQuery = 
      "SELECT t.id, "+
      "t.login, "+
      "s.avatar_name, "+
      "IFNULL(length(s.avatar_name),0) as ItIsAvatar "+
      "FROM tuser t "+
      "left join staff s on s.id_staff = t.id "+
      "WHERE t.id<>? AND t.bitdelete=0";  
      
      const resUsers = await conn.query(sQuery, [currentID]);
      return JSON.stringify(resUsers);

  } catch (err) {
      return  err;
  } finally {
    if (conn) conn.release(); 
  }
 }


async function asyncNewUser(newuser) {
  let conn = await pool.getConnection();
  try {

      const params = [newuser.name, newuser.email, newuser.password, newuser.fio, newuser.organization];
      const curNewUser = await conn.query("INSERT tuser (login, email, bitdelete, PASSWORD, fio, ORGANIZATION) VALUE (?, ?, 0, ?, ?, ?)", 
                                             params);

      return JSON.stringify(curNewUser);
  } catch (err) {
      return  err;
  } finally {
    if (conn) conn.release(); 
  }
}


async function asyncUser(sUser) {


  let conn = await pool.getConnection();
  try {

    const params = [sUser, sUser];
    // console.log('sUser=', sUser);
     const resTest = await conn.query("select * from tuser where bitdelete=0 and (login=? or email=?)", params);
     return JSON.stringify(resTest);
    } catch (err) {
      return  err;
    } finally  {
        if (conn) conn.release(); 
  }

}


async function asyncUserAccessMenu(id_user) {

  let conn = await pool.getConnection();
  try {
    const sQuery =
    " select asm.id_menu, am.name as RefName, am.rus_name as RusName, 1 as boolAccess from access_staff_menu asm,  access_menu am where "+
    " am.id_menu = asm.id_menu and asm.id_staff=? "+
    " union all "+
    " select id_menu, name as RefName, rus_name as RusName, 0 as boolAccess from access_menu "+
    " where bitDelete=0 and "+
    "  id_menu not in (select asm.id_menu from access_staff_menu asm where asm.id_staff=?) "+
    " order by id_menu";

     const params = [id_user, id_user];
     const resTest = await conn.query(sQuery, params);

     return JSON.stringify(resTest);
    } catch (err) {
      return  err;
    } finally  {
        if (conn) conn.release(); 
  }

}


// return this.http.post(sUrl, {insert_menu_access: 'insert_menu_access',  access: bollAccess, id_menu, RefName, id_user: selectedUser});



module.exports = router;
