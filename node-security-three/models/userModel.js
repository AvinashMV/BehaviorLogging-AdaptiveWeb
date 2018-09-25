var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/userauth');

var db = mongoose.connection;

var userSchema = mongoose.Schema({
    username: {
        type: String,
        trim:true,
        required: true,
        minlength: 1,
        unique: true
    },

    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 1
    },

    history:[{
        type: String
    }],

    question:[{
        Day:String,
        count: { type:Number, default: 0}
    }],

    search:[{
        Day:String,
        count: {type:Number,default: 0}
    }],

    pageScroll:[{
        Day:String,
        count: {type:Number,default: 0}
    }]
});


var User = mongoose.model('User',userSchema);


var saveTimeStamp = function(user, callback){

    user.history.push(new Date());
    user.save(callback);

};



var createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {

            newUser.password = hash;
            newUser.save(callback);

        });
    });
};

var getUserById = function(id,callback){
    //console.log('Inside gerUserById',id);
    User.findById(id,callback);
};

var getUserByUsername = function(username,callback){
    //console.log('inside getUserByUsername ',username);
    var query = {username};
    User.findOne(query,callback);
};

var comparePassword = function(candidatePassword,hash,callback){
    // console.log('inside comparePassword', candidatePassword);
    bcrypt.compare(candidatePassword,hash,function(err,isMatch){
        callback(null,isMatch);
    });
};


// ------------------------------------------------ for capture user actions.


var captureQuestion = function(user, pcount, callback){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    today = "9/20/2018";
    var dbcurRecord = null;
    User.findById(user._id, function(err,obj){
        if(err)
            return console.log(`error to find user by id in captureQuestion`);

        questionArray = obj.question;

        found = false;
        for(var i=0;i<questionArray.length;i++){
            if(questionArray[i].Day === today){
                questionArray[i].count +=pcount;
                found = true;
                break;
            }
        }

        if(questionArray === undefined || found==false ){
            var ob = {Day:today, count:pcount};
            questionArray.push(ob)
        }
        obj.save(callback);
    });
}; // end of the captureQuestion.

var captureSearch = function(user, pcount, callback){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var dbcurRecord = null;
    User.findById(user._id, function(err,obj){
        if(err)
            return console.log(`error to find user by id in captureQuestion`);

        searchArray = obj.search;

        found = false;
        for(var i=0;i<searchArray.length;i++){
            if(searchArray[i].Day === today){
                searchArray[i].count +=pcount;
                found = true;
                break;
            }
        }

        if(searchArray === undefined || found==false ){
            var ob = {Day:today, count:pcount};
            searchArray.push(ob)
        }
        obj.save(callback);
    });
};

var captureScroll = function(user, pcount, callback){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var dbcurRecord = null;
    User.findById(user._id, function(err,obj){
        if(err)
            return console.log(`error to find user by id in captureQuestion`);

        scrollArray = obj.pageScroll;

        found = false;
        for(var i=0;i<scrollArray.length;i++){
            if(scrollArray[i].Day === today){
                scrollArray[i].count +=pcount;
                found = true;
                break;
            }
        }

        if(scrollArray === undefined || found==false ){
            var ob = {Day:today, count:pcount};
            scrollArray.push(ob)
        }
        obj.save(callback);
    });
};

module.exports = {
    User,
    createUser,
    getUserById,
    getUserByUsername,
    comparePassword,
    saveTimeStamp,
    captureQuestion,
    captureScroll,
    captureSearch,
};