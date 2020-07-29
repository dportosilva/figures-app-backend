const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const Level = require('../../model/Level');

/**
 * @route POST api/levels/add-level
 * @desc Add new level 
 * @access Admin
*/

router.post('/add-level', (req, res) => {
    let{
        number, 
        question,
        goodTime,
        mediumTime,
        badTime,
        images,
        classes
    } = req.body
    //check for the unique email
    Level.findOne({
        number: number
    }).then(level => {
        if(level){
            return res.status(400).json({
                msg:"The level with this number is already in the system"
            });   
        } else {
            //the data is valid and now we can registe the user
            let newLevel = new Level({
                number,
                question,
                goodTime,
                mediumTime,
                badTime,
                images,
                classes
            });
            newLevel.save().then(level => {
                return res.status(201).json({
                    success: true,
                    msg:"Level added sucessfully"
                });
            })
        }
    });
});

/**
 * @route GET api/levels
 * @desc Return all level's data
 * @access Public
*/

router.get('/levels', (req, res) => {
    Level.find({}).sort({'number': 1}).collation({locale: "en_US", numericOrdering: true}).then(function(levels){
        res.json(levels)
    })
});


/**
 * @route GET api/levels/:number
 * @desc Return one level's data
 * @access Public
*/

router.get('/levels/:number', (req, res) => {
    Level.findOne({number: req.params.number}).then(function(err,level){
        if (err){
            res.send(err)
        }
        res.json(level)
    })
});


/**
 * @route PUT api/levels/:number
 * @desc Modify one level's data
 * @access Public
*/

router.put('/levels/:number', (req, res) => {
    Level.findOneAndUpdate({
        number: req.body.number,
        images: req.body.images,
        verification: req.body.verification,
        goodTime: req.body.goodTime,
        mediumTime: req.body.mediumTime,
        badTime: req.body.badTime,
        classes: req.body.classes
    }).then(function(err,level){
        if (err){
            res.send(err)
        }
        res.json(level)
    })
});




/**
 * @route DELETE api/levels/:number
 * @desc Delete level
 * @access Public
*/

router.delete('/levels/:number', (req, res) => {
    Level.findOneAndRemove({number: req.params.number}).then(function(err,level){
        if (err){
            res.send(err)
        }
        res.json(level)
    })
});


module.exports = router;