const asyncHandler = (returnHandler)=>{
    return (req, res , next) =>{
        Promise.resolve(returnHandler(req,res , next))
        .catch((err)=>{
            next(err)
        })
    }
}





export {asyncHandler}