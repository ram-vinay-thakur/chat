import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: false,
        maxlength: 500,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
    location: {
        type: String,
        required: false,
    },
    shareCount: {
        type: Number,
        default: 0,
    },
    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    tags: [{
        type: [String],
    }],
    isActive: {
        type: Boolean,
        default: true,  
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);
export default Post;
