var mongoose = require('mongoose');
var Comments = mongoose.model('Comment');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

//UPDATE AN EXISTING COMMENT
module.exports.commentUpdateOne = function(req, res) {
  console.log("in comment update");
  if (!req.params.commentid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, commentid is required"
    });
    return;
  }
  console.log(req.params.commentid);
  Comments
    .findById(req.params.commentid)
    .select('author, body') 
    //'-' states that we don't want to retreive
    //from db.
    .exec(
      function(err, comment) {
        if (!comment) {
          sendJSONresponse(res, 404, {
            "message:": "commentid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        if (req.body.author !== undefined) {
          console.log("in if");
           comment.commentAuthor = req.body.commentAuthor;
        }
        if (req.body.body !== undefined) {
          comment.commentContent = req.body.commentContent;
        }
        comment.save(function(err, comment) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, comment);
          }
        });
      }
  );
};

//DELETE A COMMENT
module.exports.deleteComment = function(req, res) {
  var commentid = req.params.commentid;
  console.log(commentid);
  if (commentid) {
    Comments
      .findByIdAndRemove(commentid)
      .exec(
        function(err, commentAuthor) {
          if (err) {
            console.log(err);
            sendJSONresponse(res, 404, err);
            return;
          }
          console.log("Comment id " + commentid + " deleted");
          sendJSONresponse(res, 204, null);
        }
      );
  }
  else {
    sendJSONresponse(res, 404, {
      "message": "No commentid"
    });
  }
};

//CREATE NEW COMMENT
module.exports.commentCreate = function(req, res) {
  console.log("req.body._id");
  Comments.create({
    author: req.body.author,
    body: req.body.body,
    event: req.params.id,
    created: Date.now(),  // created: req.body.commentTimestamp,
  }, function(err, location) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    }
    else {
      console.log(location);
      sendJSONresponse(res, 201, location);
    }
  });
};

//GET ALL COMMENTS
module.exports.getComments = function(req, res) {
  console.log('GET all Comments');
  console.log(req.query);
  //methods from mongo db driver  
  Comments.collection
    .find()
    .toArray(function(err, docs) {
      // error says if query failed
      // docs is the query result, an array
      console.log("Found comment", docs.length);
      res
        .status(200) // set res.status to 200 
        .json(docs); // set res.json to docs 
    });
};
