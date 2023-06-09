var express = require('express');
var router = express.Router();

var Message = require('emailjs').Message;
var SMTPClient = require('emailjs').SMTPClient;
var connectionSMTP = require('../SMTPServer');

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);




function sendMessage(sMailTo, sPwd) {

    // console.log('a1');
    const client = new SMTPClient({
        user: connectionSMTP.user,
        password: connectionSMTP.password,
        host: connectionSMTP.host,
        port: connectionSMTP.port,
        ssl: connectionSMTP.ssl
    });

    // console.log('a2');

    const message = new Message({
        text: 'ваш новый пароль ',
        from: connectionSMTP.userForFromLetter,
        to: sMailTo,
        subject: connectionSMTP.subject,
        attachment:
            [
                {data:"<html>Ваш новый пароль: "+sPwd+"</html>", alternative:true}
            ]
    });

    // console.log('a3');

    client.send(message, (err, message) => {
      if (err)  console.log(err);
    });

}

async function asyncNewPasswordSend (hash, email, pwd) {

    let conn = await pool.getConnection();
    try {

        // console.log('s1');
        const params = [hash, email];
        const curUpdateUser = await conn.query("UPDATE tuser SET PASSWORD = ? WHERE email = ? AND bitdelete = 0", params);
        // console.log('s2');
        sendMessage(email, pwd);
        // console.log('s3');
        // console.log('email=', email, 'pwd=',  pwd, 'hash=', hash);
        return JSON.stringify(curUpdateUser);
    } catch (err) {
        return  err;
    } finally {
        if (conn) conn.release(); 
    }
}


router.post('/', async function(req, res) {
    if (req.body['email'] && req.body['pwd'] && req.body['hash']) {
        const result = await asyncNewPasswordSend(req.body['hash'], req.body['email'], req.body['pwd']);
        res.send(result);
    }
});

router.get('/', function(req, res, next) {
    res.send(JSON.stringify(res));
});


module.exports = router;