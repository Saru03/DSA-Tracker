const Problem=require('./models/problem');
const {problemJoiSchema}=require('./schemas')
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo =(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    const {id}=req.params
    const problem=await Problem.findById(id);
    if(!problem.author.equals(req.user._id)){
        req.flash('error','You do not have permission to edit');
        return res.redirect('/home');
    }
    next();
}

module.exports.validateProblem=(req,res,next)=>{
    const {error}=problemJoiSchema.validate(req.body);
    console.log(req.body);
    if(error){
        const msg=error.details.map(el =>el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}




