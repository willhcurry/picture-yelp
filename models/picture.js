var mongoose = require("mongoose");

//Schema setup
var pictureSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
}, {
    usePushEach: true
});


module.exports = mongoose.model("Picture", pictureSchema);