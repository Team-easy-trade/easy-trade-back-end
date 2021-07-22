const listingModel = require("../../model/listing.js");

async function getAllListings(req, res, next) {
  // try {
  //   const listingList = await listingModel.find({});
  //   res.status(200).json(listingList);
  // } catch (error) {
  //   next(error);
  // }

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
      currentPage: page
    })}
  catch(error){
    next(error)
  }
 
}

//needs middleware
async function postListing(req, res, next) {
  try {
    const listing = new listingModel(req.body);
    const savedListing = await listing.save();
    res.status(200).send("status ok, listing saved.");
  } catch (error) {
    next(error);
  }
}

//delete..middleware
async function deleteListing(req, res, next) {
  const id = req.params.id;
  try {
    result = await listingModel.findByIdAndDelete(id);
    res.status(200).send("Deleted");
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
    result = await existingListingInfo.save();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

//get all usernames
async function getAllListingsByUserId(req, res, next) {
  const id = req.params.id;
  try {
    const listingList = await listingModel.find({ owner: id });
    res.status(200).json(listingList);
  } catch (error) {
    next(error);
  }
}

//get all listings under the same category
async function getAllListingsByCategory(req, res, next) {
  const category = req.params.category;
  try {
    const listingList = await listingModel.find({ category });
    res.status(200).json(listingList);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllListings,
  postListing,
  deleteListing,
  editListing,
  getAllListingsByUserId,
  getAllListingsByCategory,
};
