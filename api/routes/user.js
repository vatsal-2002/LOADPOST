const express =require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'dlfwb8zfl', 
    api_key: '216913842491246', 
    api_secret: 'X-T09LM1xdv70sHSkaiad1bmfI0',
    secure: true
  });


// Route to get all student data
router.get('/', (req, res, next) => {
    User.find()
        .then(result => {
            res.status(200).json({
                userData: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Route to get paginated student data
router.get('/paginate', (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Current page (default: 1)
    const limit = 4; // Number of records per page

    User.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .then(result => {
            res.status(200).json({
                userData: result,
                currentPage: page,
                totalPages: Math.ceil(result.length / limit)
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.get('/:id', (req, res, next) => {
    console.log(req.params.id);
    User.findById(req.params.id)
    .then(result => {
        res.status(200).json({
            user: result
        })
    })

    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})
  


// POST route for creating a new student record
router.post('/', (req, res, next) => {
    console.log(req.body);
    const file = req.files.photo;
    cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: err });
        }

        console.log(result);

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            gender: req.body.gender,
            imagePath: result.url
        });

        user.save()
            .then(savedUser => {
                console.log(savedUser);
                res.status(200).json({
                    newStudent: savedUser
                });
            })
            .catch(saveError => {
                console.log(saveError);
                res.status(500).json({
                    error: saveError
                });
            });
    });
});

// PUT route for updating an existing student record
router.put('/:id', (req, res, next) => {
    console.log(req.params.id);
    const file = req.files.photo;

    if (file) {
        cloudinary.uploader.upload(file.tempFilePath, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err });
            }
            updateUser(req.params.id, req.body, result.url, res);
        });
    } else {
        updateUser(req.params.id, req.body, null, res);
    }
});

function updateUser(userId, updatedData, imagePath, res) {
    const updateFields = {
        name: updatedData.name,
        phone: updatedData.phone,
        email: updatedData.email,
        gender: updatedData.gender
    };

    if (imagePath) {
        updateFields.imagePath = imagePath;
    }

    User.findOneAndUpdate({ _id: userId }, { $set: updateFields })
        .then(result => {
            res.status(200).json({
                updated_User: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


router.delete('/:id', (req,res,next) => {
    User.deleteMany({_id:req.params.id})
    .then(result => {
        res.status(200).json({
            message: "data deleted",
            result: result
        })
    })

    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router;