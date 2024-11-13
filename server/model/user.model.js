import { Schema, model } from "mongoose";

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        maxLength: 150
    },
    website: {
        type: String
    },
    profilePicture: {
        type: String
    },
    isPrivate: {
        type: Boolean
    },
    followersCount: {
        type: Number,
    },
    followingCount: {
        type: Number
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    savedPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    isVerified: {
        type: Boolean,
        default: false
    },
    notifications: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
},
    {
        timestamps: true
    }
);

const userModel = model('User', userSchema);
export default userModel;