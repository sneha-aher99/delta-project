const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
     url: String,
     filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
 
});

const Listing = mongoose.model("Listing", listingSchema);

// Check if the "Sample Listing" already exists
Listing.findOne({ title: "Sample Listing" })
  .then((existingListing) => {
    if (!existingListing) {
      // If no listing with the title "Sample Listing" exists, create and save it
      const listing = new Listing({
        title: "Sample Listing", // Make sure to set all required fields
        image:
          "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        price: 100,
        location: "Sample Location",
        country: "Sample Country",
      });

      listing
        .save()
        .then(() => {
          console.log("Sample Listing saved successfully!");
        })
        .catch((error) => {
          console.error("Error saving sample listing:", error);
        });
    } else {
      console.log("Sample Listing already exists, skipping creation.");
    }
  })
  .catch((error) => {
    console.error("Error checking for existing sample listing:", error);
  });

listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing) {
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }  
});

module.exports = Listing;
