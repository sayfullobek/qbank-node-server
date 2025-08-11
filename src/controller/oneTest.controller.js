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