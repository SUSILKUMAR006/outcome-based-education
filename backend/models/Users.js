import mongoose from "mongoose";
import bcrypt from 'bcrypt-nodejs'
const UsersSchema = new mongoose.Schema({
    userName:{ type:String , require:true},
    email:{ type:String , require:true, unique:true},
    password:{ type:String , require:true}
})


UsersSchema.pre("save" , function (next) {
    var user = this;

    if(!user.isModified("password"))
    {
        return next();
    }
    bcrypt.hash(user.password , null , null , (err, hash)=>{
        if(err){
            return next(err);
        }

        user.password = hash;
        next();
    });

} )

const UserModel = mongoose.models.user || mongoose.model("user", UsersSchema);
export default UserModel;