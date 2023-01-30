//intialising express router
const Router = require("express").Router()

const BookModel = require("../../database/book")

/* Books get  --------------------------------------------------------------------------------- */

/* 
route              /
description        all books
access             Public
parameters         None
method             get
*/
Router.get("/", async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json({books :getAllBooks});
});

/* 
route              /is
description        specific book
access             Public
parameters         isbn
method             get
*/

Router.get("/is/:isbn", async (req,res) => {
    const requiredBook = await BookModel.findOne({ISBN : req.params.isbn});
    //const requiredBook = database.books.filter((book) => book.ISBN === req.params.isbn);
    if(!requiredBook) return res.json({error : "Book not found"});
    return res.json({book : requiredBook});
});

/* 
route              /c
description        book based on category
access             Public
parameters         category
method             get
*/

Router.get("/c/:category", async (req,res) => {
    const requiredBook = await BookModel.findOne({category : req.params.category});
    /*const requiredBook = database.books.filter((book) =>{ 
    let bo = false;
    for(let i=0;i<book.category.length;i++){
        if(book.category[i].toLowerCase()===req.params.category.toLowerCase()){
            bo=true;
            break;
        }
    }
    return bo;
    }
    );*/
    if(!requiredBook) return res.json({error : "Book not found"});
    return res.json({book : requiredBook});
});

/* 
route              /a/:author
description        book based on author
access             Public
parameters         category
method             get
*/

Router.get("/a/:author",async (req,res) => {
    const requiredBook = await BookModel.findOne({Authors : parseInt(req.params.author)});
    /*const requiredBook = database.books.filter((book) =>{ 
    let bo = false;
    for(let i=0;i<book.Authors.length;i++){
        if(book.Authors[i]===parseInt(req.params.author)){
            bo=true;
            break;
        }
    }
    return bo;
    }
    );*/
    if(!requiredBook) return res.json({error : "Book not found"});
    return res.json({authors : requiredBook});
});

/* Books Post  --------------------------------------------------------------------------------- */

/* 
route              /new
description        add new books
access             Public
parameters         category
method             post
*/

Router.post("/new", async (req,res) => {

    const {newBook} = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({books : addNewBook, result: "book is added"});

});

/* Books   put --------------------------------------------------------------------------------- */

/* 
route              /book/update/
description        update title of a book
access             Public
parameters         isbn
method             put
*/

Router.put("/update/:isbn", async (req,res) =>{
    if(!await BookModel.findOne({ISBN : req.params.isbn})) return res.json({ result : "not found isbn"});
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN : req.params.isbn
    },{
        name : req.body.newName
    },{
        new : true
    });
    /*database.books.forEach((book) => {
        if(book.ISBN=== req.params.isbn){
            book.name=req.body.newTitle;
            return;
        }
    });*/
    return res.json({result : updatedBook});
});

/* 
route              /book/author/update
description        update/add author of a book
access             Public
parameters         isbn
method             put
*/

Router.put("/author/update/:isbn",async (req,res) =>{
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN : req.params.isbn
    },{
        $addToSet : {
            Authors : req.body.newAuthor
        }
    },{
        new : true
    });

    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id : req.body.newAuthor
    },{
        $addToSet : {
            books : req.params.isbn
        }
    },{
        new : true
    });
    /*database.books.forEach((book) => {
        if(book.ISBN=== req.params.isbn){
            const auth_id=req.body.newId;
            book.Authors.push(auth_id);
            database.Authors.forEach((auth) =>{
                if(auth_id===auth_id){
                    auth.books.push(req.params.isbn);
                    return;
                }
            });
            return;
        }
    });*/
    return res.json({books : updatedBook, authors : updatedAuthor, result :"Updated"});
});

/* Books delete  --------------------------------------------------------------------------------- */

/* 
route              /book/delete
description        deleting book
access             Public
parameters         isbn
method             delete
*/

Router.delete("/delete/:isbn", async (req,res) => {
    const newBooks = await BookModel.findOneAndDelete({
        ISBN : req.params.isbn
    });
    /*const newBooks = database.books.filter( (book) => book.ISBN !== req.params.isbn);
    database.books = newBooks;*/
    return res.json({books : newBooks, result: "book is deleted"});

});

/* 
route              /book/author/book
description        deleting author from a book
access             Public
parameters         isbn
method             delete
*/

Router.delete("/author/book/:isbn" , async (req,res) => {
    const newBook = await BookModel.findOneAndUpdate({
        ISBN : req.params.isbn
    },{
        $pull :{
            Authors : req.body.authorId
        }
    },{
        new : true
    });

    const newAuthor = await AuthorModel.findOneAndUpdate({
        id : req.body.authorId
    },{
        $pull :{
            books : req.params.isbn
        }
    },{
        new:true
    });
    /*database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            const newAuthors = book.Authors.filter((auth) => auth !== req.body.authid);
            book.Authors =newAuthors;
            return
        }
    });

    database.Authors.forEach((auth) => {
        if(auth.id === req.body.authid){
            const newbooks = auth.books.filter( (book) => book !== req.params.isbn);
            auth.books=newbooks;
            return
        }
    });*/
    return res.json({book : newBook , author: newAuthor , result : "deleted"});
});

module.exports = Router ;