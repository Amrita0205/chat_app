import mongoose from "mongoose";

const GroupSchema =new mongoose.Schema({
    name:
    {
        type:String,
         required:true
    },
    members:[
        {

            type:mongoose.Types.ObjectId,
            ref:'User'
        }
    ]
},{timestamps:true});

const Group=mongoose.model('Group',GroupSchema);
export default Group;