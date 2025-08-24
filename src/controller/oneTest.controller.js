const oneTest = require("../models/oneTest")

module.exports.getAll = async (req, res) => {
    try{
        const id = req.users
        const all = await oneTest.find({user: id._id})

        res.status(200).json({data: all, success: true})
    }catch(err){
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
}

// Get OneTest records by test ID for review
module.exports.getByTestId = async (req, res) => {
    try {
        const testId = req.params.testId;
        
        const oneTests = await oneTest.find({ test: testId })
            .populate({
                path: 'question',
                populate: [
                    {
                        path: 'Subjects',
                        model: 'subjects',
                        select: 'name code'
                    },
                    {
                        path: 'Systems', 
                        model: 'systems',
                        select: 'name description'
                    }
                ]
            })
            .sort({ createdAt: 1 })
            .lean();

        res.status(200).json({
            success: true,
            data: oneTests
        });
        
    } catch (err) {
        console.error('OneTest getByTestId error:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}