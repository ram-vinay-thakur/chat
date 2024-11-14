import userModel from "../../model/user.model.js";

const userResolver = {
    users: () => games,
    addUser: async ({ input }) => {
        console.log(input)
    }
};

export { userResolver };