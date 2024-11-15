import userModel from "../../model/user.model.js";
import { ApiError } from "../../utils/ApiError.js"

const userResolver = {
    users: () => games,
    addUser: async ({ input }) => {
        try {
            const existingUser = await userModel.findOne({ email: input.email });
            if (existingUser) {
                throw new Error('Email is already in use.');
            }

            const newUser = new userModel({
                username: input.username,
                email: input.email,
                password: input.password,
                name: input.name,
            });
            await newUser.save();

            return {
                id: newUser._id.toString(),
                username: newUser.username,
                email: newUser.email,
                name: newUser.name,
            };
        } catch (error) {
            return new ApiError(500, error.message)
        }
    }
};

export { userResolver };