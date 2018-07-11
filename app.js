var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Picture = require('./models/picture'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    SeedDB = require('./seeds');
    

mongoose.connect('mongodb://localhost/the_list');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//Erase DB
SeedDB();

//Passport configuration
app.use(require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.get('/', function(req, res){
    res.render('landing');
});

// Index route - show all pictures
app.get('/pictures', function(req, res){
    // Get all pictures from DB
    Picture.find({}, function(err, allPictures){
        if(err){
            console.log(err);
        } else {
            res.render('pictures/index', { pictures: allPictures, currentUser: req.user });
        }
    })
});

// Create route - add new picture to DB
app.post('/pictures', function(req, res){
    // get data from form and add to pictures array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newPicture = {name: name, image: image, description: desc};
    // create a new picture and save to DB
    Picture.create(newPicture, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // redirect to pictures page
            res.redirect('/pictures');
        }
    });
});

// New route - show form to create new picture
app.get('/pictures/new', function(req, res){
    res.render('pictures/new');    
});

// Show route - shows info about one picture
app.get('/pictures/:id', function(req, res){
    // find the picture with provided ID
    Picture.findById(req.params.id).populate('comments').exec(function(err, foundPicture){
        if(err){
            console.log(err)
        } else {
            console.log(foundPicture);
            // render show template with that picture
            res.render('pictures/show', {picture: foundPicture});
        }
    });
    req.params.id
    
});

//COMMENTS ROUTES

app.get('/pictures/:id/comments/new', isLoggedIn, function(req, res){
    //Find picture by id
    Picture.findById(req.params.id, function(err, picture){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {picture: picture});
        }
    });
});

app.post('/pictures/:id/comments', isLoggedIn, function(req, res){
    // Look up picture using ID
    Picture.findById(req.params.id, function(err, picture){
        if(err){
            console.log(err);
            res.redirect('/pictures');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    picture.comments.push(comment);
                    picture.save();
                    res.redirect('/pictures/' + picture._id);
                }
            });
        }
    });
    // Create new comment
    // Connect new comment to picture
    // Redirect to picture show page
});


// Authourization routes //

// Show register form
app.get('/register', function(req, res){
    res.render('register');
});
// Handle sign up logic
app.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/pictures');
        });
    });
});

// Show login form
app.get('/login', function(req, res){
    res.render('login');
});
// Handling login logic
app.post('/login', passport.authenticate('local', {
    successRedirect: '/pictures',
    failureRedirect: '/login'
    }), function(req, res){
    res.send('Login logic happens here');
});

// Logic route
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/pictures');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log('Picture Yelp has started!');
});