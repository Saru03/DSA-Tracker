const Problem=require('../models/problem');
const problem = require('../models/problem');
const nextReviewDate=require('../public/javascripts/reviewPriority').nextReviewDate;

module.exports.index = async (req,res,next)=>{
    const problems= await Problem.find({});
    for(let problem of problems){
        await nextReviewDate(problem.postedDate,problem.reviewCount)
    };
    res.render('problems/index',{problems});
    
}
module.exports.renderNewForm=(req,res) =>{
    res.render('problems/new');
}

module.exports.createProblem=async(req,res)=>{
    const newProblem=new Problem(req.body.problem);
    newProblem.author=req.user._id;
    await newProblem.save();
    await nextReviewDate(newProblem.postedDate,newProblem.reviewCount)
    req.flash('success','You have succesfully created a solution for a new problem!');
    res.redirect(`problems/${newProblem._id}`)
}

module.exports.showProblem=async (req,res)=>{
    const{id}=req.params;
    const problem=await Problem.findById(id).populate('author');
    await nextReviewDate(problem.postedDate,problem.reviewCount)
    if(!problem){
        req.flash('error','Cannot find problem :(');
        return res.redirect('/problems');
    }
    res.render('problems/show',{problem})
}

module.exports.renderEditForm=async(req,res)=>{
    const problem=await Problem.findById(req.params.id);
    await nextReviewDate(problem.postedDate,problem.reviewCount)
    if(!problem){
        req.flash('error','Cannot find problem :(');
        return res.redirect('/problems');
    }
    res.render('problems/edit',{problem});
}

module.exports.updateProblem=async(req,res)=>{
    const{id}=req.params;
    const problem= await Problem.findByIdAndUpdate(id,{...req.body.problem})
    await nextReviewDate(problem.postedDate,problem.reviewCount)
    req.flash('success','You have successfully updated the solution of the problem!')
    res.redirect(`/problems/${problem._id}`)
}

module.exports.deleteProblem=async(req,res)=>{
    const{id}=req.params;
    await Problem.findByIdAndDelete(id);
    req.flash('success','You have successfully deleted the solution of the problem!')
    res.redirect('/problems');
}

