const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret;
const Figure = require('../../model/Figure');

/**
 * @route POST api/figures/add-figure
 * @desc Add new figure
 * @access Admin
*/

router.post('/add-figure', (req, res) => {
    let{
        figURL,
        figClass
    } = req.body
    //check for the unique email
    Level.findOne({
        figURL: figURL
    }).then(figure => {
        if(figure){
            return res.status(400).json({
                msg:"The figure with this URL is already in the system"
            });   
        } else {
            //the data is valid and now we can registe the user
            let newFigure = new Figure({
                figURL,
                figClass
            });
            newFigure.save().then(figure => {
                return res.status(201).json({
                    success: true,
                    msg:"Figure added sucessfully"
                });
            })
        }
    });
});

/**
 * @route GET api/figures
 * @desc Return all figures's data
 * @access Public
*/

router.get('/', (req, res) => {
    Figure.find({}).then(function(figures){
        res.json(figures)
    })
});


/**
 * @route GET api/figures/:id
 * @desc Return one figure's data
 * @access Public
*/

router.get('/:id', (req, res) => {
    Figure.findOne({_id: req.params.id}).then(function(err,figure){
        if (err){
            res.send(err)
        }
        res.json(figure)
    })
});




/**
 * @route DELETE api/figures/:id
 * @desc Delete figure
 * @access Public
*/

router.delete('/:id', (req, res) => {
    Figure.findOneAndRemove({_id: req.params.id}).then(function(err,figure){
        if (err){
            res.send(err)
        }
        res.json(figure)
    })
});


module.exports = router;