var express = require('express');
var router = express.Router();

const mariadb = require("mariadb");
const mariadbSettings =  require('../DB');
const pool = mariadb.createPool(mariadbSettings);
const { asyncInsertChat, asyncLoadStartMessage, asyncReadMessage } = require('../modules/chat.js');

const timerExit = 10000;
let messages = [];
let users = new Map();


/* GET users listing. */
router.get('/', async function(req, res, next) {


    if (req.query.sigma_start) {
      const result = await initializeChat();
      res.send(result);
    }

    if (req.query.sigma_users) {
        const result = sigmaUsers(req.query.sigma_users);
        res.send(result);
      }

    if (req.query.sigma_message) {
        const result = getSigmaMessage();
        res.send(result);
    }      

    if (req.query.count_unread_message) {
        const result = getUnreadMessage(req.query.count_unread_message);
        res.send(result);
    }      

   
  });


  router.post('/', async function(req, res) {

    if (req.body['sigma_adduser']) {
      const result = sigmaAddUser(req.body['sigma_adduser']);
      res.send(result);
     }

     if (req.body['sigma_readmessage']) {
        const result = await sigmaMakeReadMessage(req.body['id_user'], req.body['id_user_to'], req.body['createdAt']);
        res.send(result);
       }
  
       if (req.body['insert_message']) {
        const result = await insertSigmaMessage(req.body['msg']);
        res.send(result);
       }
       

});


  //пользователь прочитал сообщение
   async function sigmaMakeReadMessage(id_user, id_user_to, createdAt) {  

    console.log(id_user, id_user_to, createdAt);
        let dataReadIndex = messages.findIndex( msg => msg.id_user == id_user && msg.id_user_to == id_user_to && msg.createdAt == createdAt);
        if (dataReadIndex > -1) {
            messages[dataReadIndex].bMarked = true;
            await asyncReadMessage(id_user, id_user_to, createdAt);
        }

        return dataReadIndex.toString();
   }



  function getSigmaMessage() {    
      return messages;
  };


  function  getUnreadMessage(id_user) {
    const resArr = messages.find(el => el.id_user_to.toString() == id_user.toString() && el.bMarked !== true).lengh.toString();
    if (!resArr) resArr = '0';
     return resArr;
  }

  
    async function insertSigmaMessage(msg) {    
      msg.createdAt = Date.now();
      messages.push(msg);
      const res = await asyncInsertChat(msg.id_user, msg.id_user_to, msg.message, msg.createdAt);
      return res;
    };





  // обновление сообщений при инициализации клиента
  async function initializeChat() {
    messages = [];
    const arrStartMessage = await asyncLoadStartMessage();
    for (key in arrStartMessage) {
      messages.push(arrStartMessage[key]);
    }
    return messages; //JSON.stringify(messages);
  };



    // добавляем пользователя в хранилище
      function sigmaAddUser(id_user) {
        users.set(id_user, new Date().getTime());
        return Object.fromEntries(users);
      }

     // просматриваем всех текущих юзеров
     function sigmaUsers(id_user) {
        
        const cuurentDate = new Date().getTime();

        // обновляем текущему юзеру время
        users.set(id_user, cuurentDate);

        //дата юзера больше 10 секунд выключаем его
        users.forEach( (value, key, user) => {
            if (Number(value)) {
                if ( (cuurentDate - Number(value)) > timerExit) {
                    users.delete(key);
                }
            }
        });

       return Object.fromEntries(users);
     };


module.exports = router;


