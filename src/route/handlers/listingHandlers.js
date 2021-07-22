const listingModel = require('../../model/listing.js');
async function getAllListings(req, res, next) {

  const { page = 1, limit = 12 } = req.query;
  try{
    const records = await listingModel.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
  
    const pageCount = await listingModel.countDocuments();
  
    res.json({
      records,
      totalPages: Math.ceil(pageCount / limit),
      currentPage: page,
    });
  }
  catch(error){
    next(error);
  }
 
}

//needs middleware
async function postListing(req, res, next) {
  try {
    const listing = new listingModel(req.body);
    await listing.save();
    res.status(200).send('status ok, listing saved.');
  } catch (error) {
    next(error);
  }
}

//delete..middleware
async function deleteListing(req, res, next) {
  const id = req.params.id;
  try {
    await listingModel.findByIdAndDelete(id);
    res.status(200).send('Deleted');
  } catch (error) {
    next(error);
  }
}
//edit...middleware
async function editListing(req, res, next) {
  const id = req.params.id;
  try {
    const existingListingInfo = await listingModel.findById(id);
    Object.keys(req.body).forEach((key) => {
      existingListingInfo[key] = req.body[key];
    });
    await existingListingInfo.save();
    res.status(200).send('record updated');
  } catch (error) {
    next(error);
  }
}

//get all usernames
async function getAllListingsByUserId(req, res, next) {
  
  const id = req.params.id;
  const { page = 1, limit = 12 } = req.query;
  try{
    const records = await listingModel.find({ owner: id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
  
    const pageCount = await listingModel.countDocuments();
  
    res.json({
      records,
      totalPages: Math.ceil(pageCount / limit),
      currentPage: page,
    });
  }
  catch(error){
    next(error);
  }
}

//get all listings under the same category
async function getAllListingsByCategory(req, res, next) {
  const category = req.params.category;
  const { page = 1, limit = 12 } = req.query;
  try{
    const records = await listingModel.find({ category })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
  
    const pageCount = await listingModel.countDocuments();
  
    res.json({
      records,
      totalPages: Math.ceil(pageCount / limit),
      currentPage: page,
    });
  }
  catch(error){
    next(error);
  }
}

async function searchListingsByDescription(req,res,next){

  //what are we trying to do
  //we want to look at all the documents and see which ones have fields that contain the keyword
  //first we will find all of the documents, and then we will filter them out based off if their fields contain the word
  //   const parseField = '/' + req.body.keyword + '/';
 
  //   try{
  //  const query = await listingModel.find()
  //   }catch(error){
  //     next(error)
  //   }

}
module.exports = {
  getAllListings,
  postListing,
  deleteListing,
  editListing,
  getAllListingsByUserId,
  getAllListingsByCategory,
  searchListingsByDescription,
};
