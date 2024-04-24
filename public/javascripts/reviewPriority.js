const Problem=require('../../models/problem')
function getReviewPriority(daysPassed,reviewCount){
        
    if((daysPassed>=0 && daysPassed<4) && reviewCount==0)
        return "low"
    else if((daysPassed>=4 && daysPassed<7) && reviewCount==0)
        return "midway";
            
    else if(daysPassed>=7 && reviewCount==0)
         return  "high";
            
    else if((daysPassed>=7 && daysPassed<17) && reviewCount==1)
                return "low"
            
            else if((daysPassed>=17 && daysPassed<21) && reviewCount==1)
                return "midway";
            
            else if((daysPassed>=21) && reviewCount==1)
                return  "high";
            
            else if((daysPassed>=21 && daysPassed<41) && reviewCount==2)
                return createProblem.reviewPriority="low"
            
            else if((daysPassed>=41 && daysPassed<51) && reviewCount==2)
                return "midway";
            
            else((daysPassed>=51) && reviewCount==2)
                return "high";
}
module.exports.nextReviewDate=async (datePosted,reviewCount)=>{
  const lastReviewDate=new Date(datePosted)
  const currentDate=new Date();
  let timePassed =currentDate.getTime() - lastReviewDate.getTime();
  let daysPassed =Math.round(timePassed / (1000 * 3600 * 24));
  try {
    const problems=await Problem.find({});
    for(let problem of problems){
        const reviewPriority = getReviewPriority(daysPassed, reviewCount);
        problem.reviewPriority = reviewPriority;
        await problem.save();  
    };
  } catch (error) {
    console.log(error)
  }
  
}


