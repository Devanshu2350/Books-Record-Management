const express= require("express");
const {users} = require("../data/users.json");

const router = express.Router();

/**
 * route: /users
 * Method: GET
 * Description: Get all users
 * access:Public
 * Parameters: None
 */
 router.get('/',(req, res) => {
    res.status(200).json({
        success: true,
        data: users,
    });
});

/**
 * route: /users/:id
 * Method: GET
 * Description: Get single user by id
 * access:Public
 * Parameters: id
 */
router.get('/:id',(req,res) => {
    const {id} = req.params
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: user,
    });
});

/**
 * route: /users
 * Method: POST
 * Description: Create new user
 * access:Public
 * Parameters: none
 */
router.post("/", (req,res) => {
   const {id, name, surname, email, subscriptionType, subscriptionDate} =
   req.body;
   
   const user = users.find((each) => each.id === id);

   if (user){
    return res.status(404).json({
        success: false,
        message: "user exists with this id",
    });
   }

   users.push({
    id,
    name,
    surname,
    email,
    subscriptionType,
    subscriptionDate,
   });
   return res.status(201).json({
    success: true,
    data: users,
   });
});

/**
 * route: /users/:id
 * Method: PUT
 * Description: updsting user data
 * access:Public
 * Parameters: none
 */
router.put('/:id',(req,res) => {
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find((each) => each.id === id);

    if (!user)
     return res.status(404).json({ success: false, message: "user not found"});

     const updatedUser = users.map((each) =>{
        if(each.id === id){
            return{
                ...each,
                ...data,
            };
        }
        return each;
     });
     return res.status(200).json({
        success: true,
        data: updatedUser,
     });
});


/**
 * route: /users/:id
 * Method: DELETE
 * Description: Delete a user by 
 * access:Public
 * Parameters: id
 */
router.delete("/:id", (req, res) => {
    const { id } =req.params;
    const user = users.find((each) => each.id === id);

    if (!user){
        return res.status(404).json({
            success: false,
            message: "user to be deleted was not found",
        });
    }

    const index = users.indexOf(user);
    users.splice(index, 1);

    return res.status(202).json({success: true, data: users});
});

module.exports = router;