import jwt from "jsonwebtoken";
import { UserModel } from "../model/user.js";
export const authentication = async (req, res, next) => {
    try {
        let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized user" });
        }

        const decoded = jwt.verify(token, process.env.jwt_key);
        req.user = await UserModel.findById(decoded.userId).select("-password");

        console.log("Decoded User:", req.user);  // Debugging

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(403).json({ success: false, message: "Invalid token" });
    }
};
