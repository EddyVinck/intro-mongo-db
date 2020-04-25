const Post = require("./post");

const postByTitle = (title) => {
  return Post.findOne({title}).exec();
};

const postsForAuthor = async (authorId) => {
  return Post.find({author: authorId});
};

const fullPostById = (id) => {
  return Post.findById(id).populate("author").exec();
};

const allPostsSlim = (fieldsToSelect) => {
  return Post.find({}).select(fieldsToSelect).exec();
};

const postByContentLength = (maxContentLength, minContentLength) => {
  return Post.find({
    contentLength: {
      $gt: minContentLength, // inclusive would be $gte
      $lt: maxContentLength, // or $lte for "less than or equal to".
    },
  }).exec();
};

const addSimilarPosts = (postId, similarPosts) => {
  return Post.findByIdAndUpdate(
    postId,
    {
      // add a push command on similarPosts
      // push each item in similarPosts
      $push: {similarPosts: {$each: similarPosts}},
    },
    {new: true}
  ).exec();
};

module.exports = {
  postByTitle,
  postsForAuthor,
  fullPostById,
  allPostsSlim,
  postByContentLength,
  addSimilarPosts,
};
