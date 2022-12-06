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

/**
 * route: /users/subscription-details/:id
 * Method: DELETE
 * Description: Get all user subscription details 
 * access:Public
 * Parameters: id
 */
router.get("/subscription-details/:id", (req, res) => {
    const {id} = req.params;

    const user = users.find((each) => each.id === id);

    if (!user)
       return res.status(404).json({
         success: false,
         message: "user not found",
       });

    const getDateInDays = (data = "") => {
        let date;
        if (data === ""){
            //curent date
            date = new Date(); 
        } else {
            //getting date on bacis of data variable
            date = new Date(data);
        }
        let days = Math.floor(data / (1000*60*60*24));
        return days;
    };
    
    const subscriptionType = (date) => {
        if(user.subscriptionType === "Basic"){
            date = date + 90;
        }else if (user.subscriptionType === "standard"){
            date = date + 188;
        }else if (user.subscriptionType === "Premium"){
            date = date + 365;
        }
        return date;
    };
    // subscription expriration calculation
    //anuary 1, 1970, UTC. // milliseconds
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    console.log("Return Date", returnDate);
    console.log("current Date ", currentDate);
    console.log("subscription Date", returnDate);
    console.log("subscription expiry date", subscriptionExpiration);
    
    const data = {
       ...user,
       subscriptionExpired: subscriptionExpiration < currentDate,
       daysLeftForExpiration:
           subscriptionExpiration <= currentDate
             ? 0
             : subscriptionExpiration - currentDate,
        fine:
            returnDate < currentDate
               ? subscriptionExpiration <= currentDate
                 ?200
                 :100
                : 0,
    };
    res.status(200).json({
        success: true,  
        data,
    })
});

module.exports = router;