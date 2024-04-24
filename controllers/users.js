const User=require('../models/user')

module.exports.renderRegister = (req,res)=>{
    res.render('users/register');
}

module.exports.register=async(req,res,next)=>{
    try{
        const{username,email,password}=req.body;
        const user = await new User({email,username});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err) return next(err)
            req.flash('success', 'Successfully registered and logged in');
            res.redirect('/problems'); 
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render('users/login');
}

module.exports.login=(req,res)=>{
    req.flash('success',"Welcome back");
    const redirectUrl=res.locals.returnTo || '/problems'
    res.redirect(redirectUrl);

}

module.exports.logout=(req,res)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success',"GoodBye!");
        res.redirect('/home');
    })
}
