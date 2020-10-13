const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const { json } = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { database } = require('./keys');
const passport = require('passport');
// Inicializaciones

const app = express();
require('./lib/passport');

// Configuraciones/Settings

app.set('Port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars') 
}));
app.set('view engine', '.hbs'); 

// Middlewares (Se ejecuta cada vez que un usuario envia una petición)

app.use(session({
    secret: 'Ignaciomysqlapp',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


// Global Variables

app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    next();
});

// Routes

app.use(require('./routes/index.js'));
app.use(require('./routes/authentication'));
app.use('/links' , require('./routes/links'));

// Public

app.use(express.static(path.join(__dirname, 'public')));

// Starting Server

app.listen(app.get('Port'), () => {
    console.log('Server on Port', app.get('Port'));
}); 