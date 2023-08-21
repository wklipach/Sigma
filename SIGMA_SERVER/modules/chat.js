
const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);




async function asyncInsertChat(id_user, id_user_to, message, createdAt) {
    let conn = await pool.getConnection();
    try {

       const params = [id_user, id_user_to, message, createdAt];
       const sInsertChat = 
       " insert chat (id_user, id_user_to, message, createdAt, datetimeAt) "+
       " value(?,?,?,?, now()) ";

        const resInsertChat = await conn.query(sInsertChat, params);
        return JSON.stringify(resInsertChat);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }
  
  
  async function asyncReadMessage(id_user, id_user_to, createdAt) {
    let conn = await pool.getConnection();
    try {

       const params = [id_user, id_user_to, createdAt];
       const sReadMessage = 
       " update chat set bMarked = true where id_user=? and id_user_to=? and createdAt=?";

        const resReadMessage = await conn.query(sReadMessage, params);
        return JSON.stringify(resReadMessage);
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }



  async function asyncLoadStartMessage() {
    let conn = await pool.getConnection();
    try {

       const sLoadStartMessage = "select id_user, id_user_to, message, bMarked, createdAt from chat where datetimeAt >= DATE_SUB(now(), INTERVAL 1 MONTH)";
       
        const resLoadStartMessage = await conn.query(sLoadStartMessage);
        return resLoadStartMessage;
      } catch (err) {
        return  err;
      } finally  {
          if (conn) conn.release(); 
    }
  }  

  


  exports.asyncInsertChat = asyncInsertChat;
  exports.asyncLoadStartMessage = asyncLoadStartMessage;
  exports.asyncReadMessage = asyncReadMessage;
 
  module.exports = { ...module.exports }