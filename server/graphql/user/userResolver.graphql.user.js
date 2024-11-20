import userModel from "../../model/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import redis from "../../redis/redisClient.js";
import bcrypt from 'bcryptjs';
import { generateOTP } from "../../utils/generateOtp.js";
import sendOtp from "../../utils/sendOtp.js";

const userResolver = {
    users: () => games,

    addUser: async ({ input }) => {
        try {
            const existingUser = await userModel.findOne({ email: input.email });
            if (existingUser) {
                throw new Error('Email is already in use.');
            }

            const hashedPassword = await bcrypt.hash(input.password, 12)

            const newUser = {
                username: input.username,
                email: input.email,
                password: hashedPassword,
                name: input.name,
            };

            const redisKey = `newUser:${newUser.email}`;
            const expiry = 1800; // 30 minutes
            await redis.set(redisKey, JSON.stringify(newUser), 'EX', expiry);

            return {
                username: newUser.username,
                email: newUser.email,
                name: newUser.name,
                dob: null,
                redisKey: redisKey,
                success: true
            };
        } catch (error) {
            return new ApiError(500, error.message);
        }
    },

    addUserDOB: async ({ input }) => {
        try {
            const { redisKeyfromClient, dob } = input;

            const redisKey = `${redisKeyfromClient.trim()}`;
            const userData = await redis.get(redisKey);

            if (!userData) {
                throw new ApiError(404, 'User not found in Redis.');
            }

            // Parse the user data from Redis
            const user = JSON.parse(userData);

            const isOlderThan12 = (dob) => {
                // Validate and parse the date of birth
                const birthDate = new Date(String(dob));
                console.log(birthDate)
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDifference = today.getMonth() - birthDate.getMonth();

                // Adjust age if the current month/day is before the birth month/day
                if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                console.log(age)
                // Return true if the age is greater than 12
                return age > 12;
            };


            // Add DOB to the user data
            if (isOlderThan12(dob)) {
                user.dob = dob;
                const otp = generateOTP();
                sendOtp(user.email, otp);
                // Save updated data back to Redis
                await redis.set(redisKey, JSON.stringify({ ...user, otp }), 'EX', 1800); // Extend expiry
                return {
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    dob: user.dob,
                    redisKey: redisKey
                };
            } else {
                return new ApiResponse(400, null, `User is not older than 12 years`)
            }

        } catch (error) {
            return new ApiError(500, error.message);
        }
    },

    validateOtp: async (args, context) => {
        try {
            const { input } = args;
            const { redisKey, otp } = input;
            const { req, res } = context;

            // Fetch user data from Redis
            const userData = await redis.get(redisKey);

            if (!userData) {
                return new ApiError(404, 'OTP data not found in Redis.');
            }

            const parsedUser = JSON.parse(userData);

            // Check if OTP matches
            if (parsedUser.otp === otp) {
                // Remove OTP after validation
                delete parsedUser.otp;

                // Create and save user in MongoDB
                const dbUser = new userModel(parsedUser);
                await dbUser.save();

                // Find the saved user (findOne is preferred for single user search)
                const savedUser = await userModel.findOne({ email: parsedUser.email }).select('-password');

                if (!savedUser) {
                    return new ApiError(500, 'User could not be saved or found.');
                }

                // Set the user session
                req.session.user = savedUser._id;

                // Return success response
                return {
                    _id: savedUser._id,
                    email: savedUser.email,
                    name: savedUser.name,         
                    username: savedUser.username,
                    profilePicture: savedUser.profilePicture, 
                    isVerified: savedUser.isVerified,
                    followersCount: savedUser.followersCount,
                    followingCount: savedUser.followingCount
                }
            } else {
                return new ApiResponse(400, null, `Invalid OTP for user: ${redisKey}`);
            }

        } catch (error) {
            console.error("Error in validateOtp resolver:", error);
            return new ApiError(500, 'Something went wrong!', error.message);
        }
    }
};

export { userResolver };