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
