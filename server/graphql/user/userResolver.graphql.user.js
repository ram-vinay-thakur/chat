import userModel from "../../model/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import redis from "../../redis/redisClient.js";
import bcrypt from 'bcryptjs';

const userResolver = {
    users: () => games, // Placeholder: Replace `games` with actual implementation

    addUser: async ({ input }) => {
        try {
            // Check if the user already exists in MongoDB
            const existingUser = await userModel.findOne({ email: input.email });
            if (existingUser) {
                throw new Error('Email is already in use.');
            }

            const hashedPassword = await bcrypt.hash(input.password, 12)
            // Create a new user object
            const newUser = {
                username: input.username,
                email: input.email,
                password: hashedPassword,
                name: input.name,
            };

            // Store user in Redis with a TTL (e.g., 30 minutes)
            const redisKey = `newUser:${newUser.email}`;
            const expiry = 1800; // 30 minutes
            await redis.set(redisKey, JSON.stringify(newUser), 'EX', expiry);

            return new ApiResponse(200, redisKey);
        } catch (error) {
            return new ApiError(500, error.message);
        }
    },

    addUserDOB: async ({ input }) => {
        try {
            const { redisKeyfromClient, dob } = input;

            // Fetch the user from Redis
            const redisKey = `${redisKeyfromClient.trim()}`;
            const userData = await redis.get(redisKey);

            if (!userData) {
                throw new ApiError(404, 'User not found in Redis.');
            }

            // Parse the user data from Redis
            const user = JSON.parse(userData);

            const isOlderThan12 = (dob) => {
                // Validate and parse the date of birth
                const birthDate = new Date(dob);
                if (isNaN(birthDate)) {
                    throw new Error('Invalid date of birth.');
                }

                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDifference = today.getMonth() - birthDate.getMonth();

                // Adjust age if the current month/day is before the birth month/day
                if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                // Return true if the age is greater than 12
                return age > 12;
            };


            // Add DOB to the user data
            if (isOlderThan12()) {
                user.dob = dob;
                // Save updated data back to Redis
                await redis.set(redisKey, JSON.stringify(user), 'EX', 1800); // Extend expiry

                return new ApiResponse(200, null, `DOB added for user: ${redisKey}`);
            }else{
                return new ApiError(400, `User is not older than 12 years`)
            }

        } catch (error) {
            return new ApiError(500, error.message);
        }
    },
};

export { userResolver };
