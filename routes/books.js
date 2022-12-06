const express= require("express");
const {books} = require("../data/books.json");
const {users} = require("../data/users.json");

const router = express.Router();

//default export

/**
 * route: /books
 * Method: GET
 * Description: Get all books
 * access:Public
 * Parameters: None
 */
router.get("/",(req,res) => {
    res.status(200).json({ success: true, data: books});
});

/**
 * route: /books/:id
 * Method: GET
 * Description: Get books by id
 * access:Public
 * Parameters: id
 */
 router.get("/:id",(req,res) => {
    const {id} = req.params;

    const book = books.find((each) => each.id === id);

    if (!book) 
    return res.status(400).json({
        success: false,
        message: "book not found",
    });
    return res.status(200).json({
        success: true,
        data: book,
    });
});

/**
 * route: /books/issued/books
 * Method: GET
 * Description: Get all issued books
 * access:Public
 * Parameters: none
 */
router.get("/issued/books",(req,res) => {
    const userswithIssuedBooks =users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooks = [];
    userswithIssuedBooks.forEach((each) => {
     const book = books.find((book) => book.id === each.issuedBook );
     
     book.issuedBy = each.name;
     book.issuedDate = each.issuedDate;
     book.returnDate = each.returnDate;
     
     issuedBooks.push(book);
    });

    if(issuedBooks.length === 0)
     return res.status(404).json({
        success: false,
        message: "no books issued yet",
     });

     return res.status(200).json({
        success: true,
        data: issuedBooks,
     });
});

/**
 * route: /books/issued/books
 * Method: POST
 * Description: create new book
 * access:Public
 * Parameters: none
 * data: author, name, genre, price, publisher, id
 */

router.post("/",(req, res) => {
    const {data} = req.body;

    if (!data){
        return res.status(400).json({
            success:false,
            message: "no data provided",
        });
    }

    const book = books.find((each) => each.id === data.id);

    if(book){
        return res.status(404).json({
            success: false,
            message: "user exists with this id",
        });
    }

    const allBooks =[...books, data];

    return res.status(200).json({
        success: true,
        data: allBooks,
    });
});

/**
 * route: /books/:id
 * Method: PUT
 * Description: Update book
 * access:Public
 * Parameters: id
 * data: author, name, genre, price, publisher, id
 */
router.put("/:id",(req,res) => {
    const {id} = req.params;
    const {data} = req.body;

    const book = books.find((each) => each.id === id);

    if (!book) {
        return res.status(400).json({
            success:false,
            message: "booknot found with this particular id",
        });
    }

    const updateData = books.map((each) => {
        if (each.id === id){
             return {...each, ...data };
        }
        return each;
    });

    return res.status(200).json({
        success: true,
        data: updateData,
    });
    
}) ;

module.exports = router;
