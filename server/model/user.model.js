import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const userSchema = new Schema({
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
    name: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        maxLength: 150
    },
    dob: {
        type: Date,
        required: true
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
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0
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
    },
    // Additional fields
    googleId: { type: String },
    facebookId: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    profileComplete: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    allowProfileDiscovery: { type: Boolean, default: true },
    allowPostSharing: { type: Boolean, default: true },
    address: {
        type: String
    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    preferences: {
        language: { type: String, default: 'en' },
        notificationsEnabled: { type: Boolean, default: true }
    },
    deleted: { type: Boolean, default: false },
    lastPostDate: { type: Date },
    loginCount: { type: Number, default: 0 },
},
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
    );
};

const userModel = model('User', userSchema);
export default userModel;