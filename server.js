import express from 'express';
import { json } from 'body-parser';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { error } from 'winston';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Connect to MongoDB

// Connect to MongoDB
connect('mongodb+srv://codekaushal:mypassword2024@cluster0.e65le5m.mongodb.net/<portfolio_database>?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    error('MongoDB connection error:', err);
  });

// Define a schema for the data
const MessageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

// Create a model from the schema
const Message = model('Message', MessageSchema);

// POST route for form submission
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;

  // Validate and sanitize user input
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('message', 'Message is required').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    res.status(400).send(errors);
    return;
  }

  // Create a new message object
  const newMessage = new Message({
    name,
    email,
    message
  });

  // Save the message to the database
  newMessage.save()
   .then(() => {
      res.status(200).send('Message saved successfully');
    })
   .catch(err => {
      console.error('Error saving message:', err);
      error('Error saving message:', err);
      res.status(500).send('An error occurred while saving the message');
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
