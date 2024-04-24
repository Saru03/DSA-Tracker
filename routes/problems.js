const express=require('express');
const router=express.Router()

const catchAsync=require('../utils/catchAsync')
const {isLoggedIn,isAuthor,validateProblem, updateReviewPriority} =require('../middleware');

const problems=require('../controllers/problems')

router.route('/')
    .get(isLoggedIn,catchAsync(problems.index)) 
    .post(isLoggedIn,validateProblem,catchAsync(problems.createProblem))

router.get('/new',isLoggedIn,problems.renderNewForm)

router.route('/:id')
    .get(catchAsync(problems.showProblem))
    .put(isLoggedIn,isAuthor,validateProblem, catchAsync(problems.updateProblem))
    .delete(isLoggedIn,isAuthor,catchAsync(problems.deleteProblem))

router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(problems.renderEditForm))
module.exports=router;