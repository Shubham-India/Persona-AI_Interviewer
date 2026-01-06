import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { InterviewSession } from "../models/interview_session.model.js";




const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new apiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = async (req, res) => {
    const { username, email, fullName, password } = req.body

    if (!username || !email || !fullName || !password) {
        throw new apiError(400, "All fields are required")


    }

    const existingUser = await User.findOne({ 
        $or: [ { username: username }, { email: email } ]
    })


    if (existingUser ) {
        throw new apiError(409, "User Already Exists")
    }

    const newUser = await User.create({
        username : username,
        email: email,
        fullName: fullName,
        password: password,
    });
    return res.status(201).json(new apiResponse(201,  {
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
    }, "User Created Successfully",))
}


const loginUser = async (req, res) => {
    const { username , password } = req.body;

    if (!username || !password) {
        throw new apiError(400, "Username and password are required")
    }
    const existingUser = await User.findOne({
        $or: [ { username: username } ]
    })
    if (!existingUser) {
        throw new apiError(404, "User Not Found")
    }

    if (existingUser) {
        const isMatch = await bcrypt.compare(password, existingUser.password);


        if (!isMatch) {
            return res.status(400).json({
                success: false,
                type: "password_error",
                message: "Incorrect password"
            });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(existingUser._id)

        const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {
                         userId: loggedInUser._id, username: loggedInUser.username, fullName: loggedInUser.fullName , email: loggedInUser.email, accessToken, refreshToken
                    },
                    "User logged In Successfully"
                )
            )
    }

}

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged Out"))
})


const getCurrentUser = asyncHandler(async (req, res) => {

    const user = req.user

    const no_of_Interviews = await InterviewSession.countDocuments({
        user: user._id
    });

    const userData = {
        userId: user._id,
        InterviewNO: no_of_Interviews || 0,
        email: user.email,
        fullName: user.fullName,
        username: user.username

    }


    return res.status(200).json(
        new apiResponse(200, userData, "user Fetched Successfully")
    );

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new apiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token")
    }

})

export {generateAccessAndRefereshTokens , loginUser , logoutUser , registerUser , refreshAccessToken , getCurrentUser }