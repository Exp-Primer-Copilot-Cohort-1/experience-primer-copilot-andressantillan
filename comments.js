// Create web server

// Import Express
const express = require("express");
const router = express.Router();

// Import Mongoose
const mongoose = require("mongoose");

// Import Comment model
const Comment = require("../models/comment");

// Import Post model
const Post = require("../models/post");

// Import CheckAuth middleware
const checkAuth = require("../middleware/check-auth");

// Import CheckAuth middleware
const checkPost = require("../middleware/check-post");

// Import CheckAuth middleware
const checkComment = require("../middleware/check-comment");

// Import CheckAuth middleware
const checkCommentDelete = require("../middleware/check-comment-delete");

// Import CheckAuth middleware
const checkCommentUpdate = require("../middleware/check-comment-update");

// Import CheckAuth middleware
const checkPostDelete = require("../middleware/check-post-delete");

// Import CheckAuth middleware
const checkPostUpdate = require("../middleware/check-post-update");

// Import CheckAuth middleware
const checkPostLike = require("../middleware/check-post-like");

// Import CheckAuth middleware
const checkPostDislike = require("../middleware/check-post-dislike");

// Import CheckAuth middleware
const checkPostComment = require("../middleware/check-post-comment");

// Import CheckAuth middleware
const checkPostCommentDelete = require("../middleware/check-post-comment-delete");

// Create comment
router.post(
  "/",
  checkAuth,
  checkPost,
  checkPostComment,
  checkPostCommentDelete,
  (req, res, next) => {
    // Create comment
    const comment = new Comment({
      _id: new mongoose.Types.ObjectId(),
      comment: req.body.comment,
      post: req.body.postId,
      user: req.userData.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Save comment
    comment
      .save()
      .then((result) => {
        // Update post
        Post.updateOne(
          { _id: req.body.postId },
          {
            $push: {
              comments: {
                _id: comment._id,
                comment: comment.comment,
                user: comment.user,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
              },
            },
          }
        )
          .exec()
          .then((result) => {
            // Send response
            res.status(201).json({
              message: "Comment created",
              comment: {
                _id: comment._id,
                comment: comment.comment,
                user: comment.user,
