var mongoose = require('mongoose');

// nested schema,
// declare before parent schema
var locationSchema = new mongoose.Schema({
    venueName:String,

    streetAddress: { 
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    
});

var commentSchema = new mongoose.Schema({
    author: {type: String, required: true},
    body: {type: String, required: true},
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event'},
    created: { type: Date, default: Date.now }
});

// parent schema
var eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    type: {
        type: String,
    },
    organizer: String,
    details: { 
        type: String,
        required: true
    },
    tags: {
        type:[String],
        required: true
    },
    
    // Add nested schema, reference as an array 
    location:  [locationSchema],
    
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});


// model name, schema name, collection name (optional)
// collection name will be events by default 
mongoose.model('Event', eventSchema);