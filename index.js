
var express          = require('express'),
    app              = express(),
    port             = process.env.PORT || 3006,
    bodyParser       = require('body-parser'),
    passport         = require('passport'),
    flash            = require('connect-flash'),
    morgan           = require('morgan'),
    LocalStragegy    = require('passport-local').Strategy,
    session          = require('express-session'),
    expressValidator = require('express-validator'),
    exphbs           = require('express-handlebars'),
    cookieParser     = require('cookie-parser');

    var userRoutes = require("./routes/user");
    var todoRoutes = require("./routes/todos");

    app.set('views', path.join(__dirname, 'views'));
    app.engine('handlebars', exphbs({defaultLayout:'layout'}));
    app.set('view engine', 'handlebars');

    app.use(morgan('dev')); // log every request to the console
    app.use(cookieParser()); // read cookies (needed for auth)
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(__dirname +'/public'));
    app.use(express.static(__dirname + '/views'));

    // Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

    //Connect Flash
    app.use(flash());

    //Express Validator
    app.use(expressValidator({
        errorFormatter: function(param, msg, value) {
            var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;
      
          while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
          }
          return {
            param : formParam,
            msg   : msg,
            value : value
          };
        }
      }));

      app.use(function (req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
        next();
      });

    app.get('/', function(req, res){
        res.sendFile("index.html");
    });
    
    app.use('/api/todos', todoRoutes);
    
    app.listen(port, function(){
        console.log("APP IS RUNNING ON PORT " + port);
    })
        