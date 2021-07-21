const listingModel = require('../../model/listing.js');

async function getAllListings(req,res,next){
    try{
    const listingList = await listingModel.find({});
    res.status(200).json(listingList)
    }catch(error){
        next(error)
    }
   
   
}

//needs middleware
async function postListing(req,res,next){
   
    try{
        const listing = new listingModel(req.body);
       const savedListing = await listing.save();
        res.status(200).send(
            "status ok, listing saved."
        )
    }catch(error){
        next(error)
    }
}

//delete..middleware

//edit...middleware
module.exports ={getAllListings,postListing};