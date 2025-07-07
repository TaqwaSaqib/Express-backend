
const axios = require('axios');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/',(req,res)=>{
  res.json({
    message:'Welcome to ITM Fullstack Backend API',
  })
})

const data = [
  {
    "id":1,
    "description":"do study",
  },
  {
    "id":2,
    "description":"do tasks",

  },
  {
    "id":3,
    "description":"do cooking",
  }
]

app.get('/getItems',(req,res)=>{
  res.json({
    users:data
  })
})

const myJson = '/api/modifyItems';

app.post(myJson, (req, res) => {
  try {
    const { description } = req.body;
    
    // Validate required fields
    if (!description) {
      return res.status(400).json({
        message: "description are required",
        error: "Missing required fields"
      });
    }
    
    const newUser = {
      id: data.length + 1,
      description: description,
    };
    
    // Add to data array
    data.push(newUser);
    
    res.status(201).json({
      message: "User added successfully",
      newUser: newUser,
      totalUsers: data.length
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error adding user",
      error: error.message
    });
  }
});

app.put(`${myJson}/:id`, (req, res) => {
  try {
    const id= parseInt(req.params.id);
    const { description} = req.body;
    
    // Find user by ID
    const index = data.findIndex(user => user.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        message: "User not found",
        error: "User with this ID does not exist"
      });
    }
    
    if (!description ) {
      return res.status(400).json({
        message: "PUT requires all fields (description)",
        error: "Missing required fields for complete resource replacement",
        note: "PUT replaces the entire resource, so all fields are required"
      });
    }
    
    // Replace the entire user object
    const updatedUser = {
      id: id,
      description: description,
    };
    
    data[index] = updatedUser;
    
    res.json({
      message: "User completely replaced (PUT)",
      updatedUser: updatedUser,
      note: "PUT replaced the entire resource with new data"
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
});

app.patch(`${myJson}/:id`, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { description } = req.body;
    
    // Find user by ID
    const index = data.findIndex(user => user.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        message: "User not found",
        error: "User with this ID does not exist"
      });
    }
    
    if (!description) {
      return res.status(400).json({
        message: "PATCH requires at least one field to update",
        error: "No fields provided for update",
        note: "PATCH allows partial updates, so at least one field should be provided"
      });
    }
    
    // Get current user data
    const currentUser = data[index];
    
    const updatedUser = {
      ...currentUser,
      ...(description && { description: description }),
     
    };
    
    data[index] = updatedUser;
    
    res.json({
      message: "User partially updated (PATCH)",
      updatedUser: updatedUser,
      changes: {
        description: description ? `Changed from "${currentUser.description}" to "${description}"` : "No change",
      },
      note: "PATCH updated only the provided fields, keeping other fields unchanged"
    });
    
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message
    });
  }
});


app.listen(PORT,()=>{
  console.log(`Server is running on PORT ${PORT}`);
})