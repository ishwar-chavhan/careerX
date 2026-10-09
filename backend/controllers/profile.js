const AdditionalDetail = require("../models/AdditionalDetails");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateUserInfo = async (req, res) => {
    try {
        const { about, gender, contactNumber, dateOfBirth } = req.body;
        const userId = req.userId.id;
        console.log("level1")
        if (!about || !gender || !contactNumber || !dateOfBirth) {
            return res.status(400).json({
                success: false,
                message: "all field are required"
            })
        }
         console.log("level2")
        let userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "could not able find the user"
            })
        }
        // const additionalDetailsId = userDetails.additionalDetails;

         console.log("level3")
           let updatedAdditionalDetails;

        if (userDetails.additionalDetails) {
            // Already has one — update it
            updatedAdditionalDetails = await AdditionalDetail.findByIdAndUpdate(
                userDetails.additionalDetails,
                { contactNumber, dateOfBirth, gender, about },
                { new: true }
            );
        } else {
            // First time — create one, then link it to the user
            updatedAdditionalDetails = await AdditionalDetail.create({
                contactNumber, dateOfBirth, gender, about
            });

            await User.findByIdAndUpdate(userId, {
                additionalDetails: updatedAdditionalDetails._id
            });
        }

         console.log("level4")
        userDetails = await User.findById(userId).populate("additionalDetails").exec();


        return res.status(200).json({
            success: true,
            message: "addition details updated successfully",
            userDetails,
            updatedAdditionalDetails
        })

    } catch (error) {
        console.log("error in  User updateUserInfo ", error)
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.updateProfilePicture = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const imageFile = req.files?.imageFile;
        const userId = req.userId.id;
        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image"
            })
        }
        if (!firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "all field are required"
            })
        }

        const uploadResponse = await uploadImageToCloudinary(imageFile, process.env.FOLDER_NAME, 1000, 1000);
        console.log("error3")
        const response1 = await User.findByIdAndUpdate(userId,
            {
                firstName,
                lastName,
                image: uploadResponse.secure_url,
            },
            {
                new: true
            }
        ).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            user: response1,
            imageUrl: uploadResponse.secure_url
        })
    } catch (error) {
        console.log("error in file upload me", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}