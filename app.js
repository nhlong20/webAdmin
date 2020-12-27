const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("./passport");
const flash = require("express-flash");

const dashboardRouter = require('./routes/dashboardRoutes');
const productRouter = require("./routes/productRoutes");
const usersRouter = require('./routes/usersRoutes');
const authRouter = require('./routes/authRoutes');
const orderRouter = require("./routes/orderRoutes");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layout");

app.set("layout login", false);

// Implement CORS
app.use(cors());
app.options('*', cors());


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            collection: "sessions",
        }),
        cookie: {
            maxAge: 60 * 60 * 1000, //15 secs
            // maxAge: 60* 60 * 1000 //180 mins
        },
    })
);

// Partport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware express-flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.info = req.flash('info');
    res.locals.session = req.session;
    next();
});

app.use('/auth', authRouter);
app.use("/orders", orderRouter);
app.use('/products', productRouter);
app.use('/users', usersRouter);
app.use('/', dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
