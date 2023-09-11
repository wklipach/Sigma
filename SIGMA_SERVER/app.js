var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var forgotPassword = require('./routes/forgotpassword');
var summary = require('./routes/summary');
var protected_objects = require('./routes/protected_objects');
var avatar = require('./routes/avatar');
var mtr = require('./routes/mtr');
var guide = require('./routes/guide');
var staff = require('./routes/staff');
var filters = require('./routes/filters.js');
var task = require('./routes/task.js');
var settings = require('./routes/settings.js');
var ollr = require('./routes/ollr.js');
var tabel = require('./routes/tabel.js');
var checklist = require('./routes/checklist.js');
var posts = require('./routes/posts.js');
var chalk = require ('chalk');

//var cors = require('cors');

const { asyncInsertChat, asyncLoadStartMessage, asyncReadMessage } = require('./modules/chat.js');


var app = express();
app.use(express.json({ limit: '50mb' }));


//app.use(cors);


console.log( chalk.bgRed.white(' point 1 '), chalk.bgRed.white(new Date().toLocaleTimeString()));  
//npm install chalk@4.1.2

//БЛОК1

//BEGIN СОКЕТ
const httpChat = require('http').Server(app);


const io = require('socket.io')(httpChat, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});




const portChat = process.env.portChat || 5000;

//КОНЕЦ БЛОК1


/* ЧУЖОЕ
socket.on('user:add', async (user) => {
  // сообщаем другим пользователям об этом
  socket.to(roomId).emit('log', `User ${userName} connected`)
  // записываем идентификатор сокета пользователя
  user.socketId = socket.id
  // записываем пользователя в хранилище
  users[roomId].push(user)
  // обновляем список пользователей
  updateUserList()
})
*/


// "хранилище" для сообщений


//БЛОК2

let messages = [];

let users = new Map();
io.on('connection', (socket) => {


  socket.on('sigma_message', async msg => {
    msg.createdAt = Date.now();
    messages.push(msg);
    io.emit('sigma_message', messages);
    await asyncInsertChat(msg.id_user, msg.id_user_to, msg.message, msg.createdAt);
  });

  // обновление сообщений при инициализации клиента
  socket.on('sigma_start', async msg => {
    messages = [];
    const arrStartMessage = await asyncLoadStartMessage();
    for (key in arrStartMessage) {
      messages.push(arrStartMessage[key]);
    }
    io.emit('sigma_start', messages);
  });

  // добавляем пользователя в хранилище
  socket.on('sigma_adduser', async (user) => {
    socket.id_user=user;
    users.set(socket.id, user);
    io.emit('sigma_users', Object.fromEntries(users));
  });

  // просматриваем всех текущих юзеров
  socket.on('sigma_users', async msg => {
    console.log( chalk.bgRed.white(' sigma_users '), chalk.bgRed.white(new Date().toLocaleTimeString()));  
    io.emit('sigma_users', Object.fromEntries(users));
  });


  //пользователь прочитал сообщение
  socket.on('sigma_readmessage', async dataRead => {
    console.log('dataRead=', dataRead);
    let dataReadIndex = messages.findIndex( msg => msg.id_user == dataRead.id_user && msg.id_user_to == dataRead.id_user_to && msg.createdAt == dataRead.createdAt);
    if (dataReadIndex > -1) {
        messages[dataReadIndex].bMarked = true;
        io.emit('sigma_readmessage', messages);
        await asyncReadMessage(dataRead.id_user, dataRead.id_user_to, dataRead.createdAt);
    }
  });

  //this.socket.emit('sigma_readmessage', id_user, id_user_to, createdAt);


  socket.on('disconnect', () => {
    console.log('disconnect', 'socket.id=', socket.id, '', 'socket.id_user=', socket.id_user);
    // удаляем пользователя из хранилища
    users.delete(socket.id);
    io.emit('sigma_users', Object.fromEntries(users));
    console.log(Object.fromEntries(users));

  });


});


httpChat.listen(portChat, () => {
  console.log(`Socket.IO server running at http://localhost:${portChat}/`);
});





//END СОКЕТ

//КОНЕЦ БЛОК2




app.use(express.json({ limit: '50mb' }));
// process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
// Add headers


app.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "http://localhost:4200" ); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/forgotpassword', forgotPassword);
app.use('/summary', summary);
app.use('/protected_objects', protected_objects);
app.use('/avatar', avatar);
app.use('/mtr', mtr);
app.use('/guide',guide);
app.use('/staff', staff);
app.use('/filters', filters);
app.use('/task', task);
app.use('/settings', settings);
app.use('/ollr', ollr);
app.use('/tabel', tabel);
app.use('/checklist', checklist);
app.use('/posts', posts);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



//app.use(usersChat);

global.appRoot = path.resolve(__dirname);
module.exports = app;
