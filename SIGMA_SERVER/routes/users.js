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
 
});


router.post('/', async function(req, res) {

  if (req.body.newuser) {
      const result = await asyncNewUser(req.body.newuser);
      res.send(result);
  }
});




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

module.exports = router;
