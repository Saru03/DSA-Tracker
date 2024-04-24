if(process.env.NODE_ENV!=="production"){
    require('dotenv').config();
}

const express=require('express');
const path=require('path');
const mongoose = require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const problemsRoutes=require('./routes/problems.js')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport');
const LocalStrategy=require('passport-local')
const userRoutes=require('./routes/user.js')
const User=require('./models/user.js')
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet')
// const dbUrl=process.env.DB_URL;
const MongoStore = require('connect-mongo');
const dbUrl='mongodb://127.0.0.1:27017/dsa-tracker'
mongoose.connect(dbUrl);
mongoose.set('strictQuery', true);

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",() =>{
    console.log("Database connected");
})

const app=express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate)

app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e);
})

const sessionConfig={
    store,
    name:'session',
    secret:'thishouldbeabettersecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(
    helmet({
        // contentSecurityPolicy:false,
    })
)

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
app.use('/',userRoutes);
app.use('/problems',problemsRoutes);

app.get('/home',(req,res)=>{
    res.render('home')
})

app.get('/test',(req,res)=>{
    console.log(new setDate().toString())
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500,message='Something went wrong'}=err;
    if(!err.message) err.message='Oh no, Something went wrong!'
    res.status(statusCode).render('error',{err});
})


app.listen(8080,()=>{
    console.log("Serving on port 8080")
})

