import mongoose from "mongoose"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            index: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/@/, "Email must contain @"],

        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    }, { timestamps: true }
);





// codes useful for crud operations

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    try {
        this.password = await bcrypt.hash(this.password, 10);
        ;
    } catch (error) {
        throw new apiError(400, "Error in hashing password");
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex");
    const hashedToken = crypto
                       .createHash("sha256")
                       .update(unHashedToken)
                       .digest("hex");
    const tokenExpiry = Date.now() + 20 *60*1000; // 20 minutes from now    
    return { unHashedToken, hashedToken , tokenExpiry };
}
export const User = mongoose.model("User", userSchema);
