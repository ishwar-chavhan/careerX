const Resume = require("../models/Resume");
const User = require("../models/User");

const MAX_RESUMES = 10;

exports.createResume = async(req , res)=>{
    try{
        const { title, contact, skills, experience, projects, education } = req.body;
        const userId = req.userId.id;

         if(!title || !contact || !skills || !experience || !projects  || !education ){
            return res.status(400).json({
                success : false,
                message : "all field are required"
            })
        }

        if(!contact || !contact.fullName){
            return res.status(400).json({
                success : false,
                message : "full name is required"
            })
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "user not found"
            })
        }

        if(user.resumeId.length >= MAX_RESUMES){
            return res.status(400).json({
                success : false,
                message : `you can save up to ${MAX_RESUMES} resumes`
            })
        }

        const resume = await Resume.create({
            title,
            contact,
            skills,
            experience,
            projects,
            education
        });

        await User.findByIdAndUpdate(userId ,
            {
                $push : {
                    resumeId : resume._id
                }
            }
        )

        return res.status(201).json({
            success: true,
            message: "Resume created successfully",
            data : resume
        });

    }catch(error){
        console.log("Error while creating resume:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create resume"
        });
    }
}

// all resumes of the logged in user, newest edited first.
// returns full documents because the list page draws a thumbnail from them
exports.getMyResumes = async(req , res)=>{
    try{
        const userId = req.userId.id;
        
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "user not found"
            })
        }

        const resumes = await Resume.find({ _id : { $in : user.resumeId } })
            .sort({ updatedAt : -1 });

        return res.status(200).json({
            success : true,
            message : "resumes fetched successfully",
            data : resumes
        })

    }catch(error){
        console.log("Error while fetching resumes:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch resumes"
        });
    }
}

exports.getResumeById = async(req, res)=>{
    try{
        const { resumeId } = req.params;
        const userId = req.userId.id;
        if(!resumeId){
            return res.status(400).json({
                success : false,
                message : "resume id is required"
            })
        }
        const user = await User.findById(userId);

        if (!user.resumeId.includes(resumeId)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this resume"
            });
        }

        const resume = await Resume.findById(resumeId);
        if(!resume){
            return res.status(404).json({
                success : false,
                message : "resume not found",
            })
        }

        return res.status(200).json({
            success : true,
            message : "resume is found",
            data : resume
        })

    }catch(error){
        console.log("Error while fetching resume:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch resume"
        });
    }
}

exports.updateResume = async(req , res)=>{
    try{
        const { resumeId } = req.params;
        const { title, contact, skills, experience, projects, education } = req.body;
        const userId = req.userId.id;
         if(!title || !contact || !skills || !experience || !projects  || !education ){
            return res.status(400).json({
                success : false,
                message : "all field are required"
            })
        }

        if(!resumeId){
            return res.status(400).json({
                success : false,
                message : "resume id is required"
            })
        }

        if(!contact || !contact.fullName){
            return res.status(400).json({
                success : false,
                message : "full name is required"
            })
        }

        const user = await User.findById(userId);
        if (!user.resumeId.includes(resumeId)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this resume"
            });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            resumeId,
            {
                $set : { title, contact, skills, experience, projects, education }
            },
            { returnDocument : "after", runValidators : true }
        );

        if(!updatedResume){
            return res.status(404).json({
                success : false,
                message : "resume not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Resume updated successfully",
            data : updatedResume
        })

    }catch(error){
        console.log("Error while updating resume:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update resume"
        });
    }
}

exports.deleteResume = async (req , res)=>{
    try{
        const { resumeId } = req.params;
        const userId = req.userId.id;
        if(!resumeId){
            return res.status(400).json({
                success : false,
                message : "resume id not received"
            })
        }
        const user = await User.findById(userId);
        if (!user.resumeId.includes(resumeId)) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this resume"
            });
        }

        const deletedResume = await Resume.findByIdAndDelete(resumeId);
        if (!deletedResume) {
            return res.status(404).json({
                success: false,
                message: "Resume not found"
            });
        }

        await User.findByIdAndUpdate(userId , {
            $pull : {
                resumeId
            }
        })

        return res.status(200).json({
            success: true,
            message: "Resume deleted successfully"
        });

    }catch(error){
        console.log("Error while deleting resume:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete resume"
        });
    }
}