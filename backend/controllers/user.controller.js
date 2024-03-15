import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const allUsersExceptMe = await User.find({ _id: { $ne: loggedInUser } })    

        return res.status(200).json(allUsersExceptMe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}