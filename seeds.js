var mongoose = require("mongoose");
var Picture = require("./models/picture");
var Comment = require("./models/comment");
    
var data = [
        {   
            name: "Strong woman",
            image: "https://images.unsplash.com/photo-1434719079929-f61498a4828e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c87a61e2fd37e4b9d13c192c5ee2a7e6&auto=format&fit=crop&w=1053&q=80",
            description: "Groomed admiral facial accessory old man in pub, facial accessory admiral groomed tricky sneezes rugged et lip warmer old man in pub ron jeremy furry facial friend. Inspector clouseau basil fawlty mexican’t blue oyster bar, Freddie mercury mr frothy-top kris kristofferson. blue oyster bar terry thomas mexican’t joseph stalin spaghetti western inspector clouseau basil fawlty?"
        },
        {   
            name: "Strong woman",
            image: "https://images.unsplash.com/photo-1434754205268-ad3b5f549b11?ixlib=rb-0.3.5&s=36879189cc78e464b7f5fd2e7e24cde0&auto=format&fit=crop&w=1053&q=80",
            description: "Groomed admiral facial accessory old man in pub, facial accessory admiral groomed tricky sneezes rugged et lip warmer old man in pub ron jeremy furry facial friend. Inspector clouseau basil fawlty mexican’t blue oyster bar, Freddie mercury mr frothy-top kris kristofferson. blue oyster bar terry thomas mexican’t joseph stalin spaghetti western inspector clouseau basil fawlty?"
        },
        {   
            name: "Strong woman",
            image: "https://images.unsplash.com/photo-1434847868581-86e8a2b8e7a3?ixlib=rb-0.3.5&s=c44db68ead7ef7ec4bdeb774a61636cd&auto=format&fit=crop&w=1054&q=80",
            description: "Groomed admiral facial accessory old man in pub, facial accessory admiral groomed tricky sneezes rugged et lip warmer old man in pub ron jeremy furry facial friend. Inspector clouseau basil fawlty mexican’t blue oyster bar, Freddie mercury mr frothy-top kris kristofferson. blue oyster bar terry thomas mexican’t joseph stalin spaghetti western inspector clouseau basil fawlty?"
        }
    ]
    

function seedDB(){
   //Remove all campgrounds
   Picture.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Picture.create(seed, function(err, picture){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "So buff!",
                                author: "William"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    picture.comments.push(comment._id);
                                    picture.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;