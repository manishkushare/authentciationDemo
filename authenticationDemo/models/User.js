const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type :String,
        minlength : 5,
        required : true
    }
},{timestamps: true});


// we are using function declaration because, we are using this value inside it
userSchema.pre('save', async function (next){
    if(this.password && this.isModified('password')){
        try{
            const hashed =   await  bcrypt.hash(this.password, 10);
            this.password = hashed;
            return next();
        }
        catch(error){
           return next(err);
        }
    }
    else{
        return next();
    }
});
//method on user schema
userSchema.methods.verifyPassword = async function(password,cb ){
    try{
        const verify = await bcrypt.compare(password, this.password);
        return cb(null, verify);
    }   
    catch(err){
        return cb(err);
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;