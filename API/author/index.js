const Router = require("express").Router();

const AuthorModel = require("../../database/author");

/* Authors get  --------------------------------------------------------------------------------- */

/* 
route              /
description        all authors
access             Public
parameters         None
method             get
*/

Router.get("/", async (req,res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({books : getAllAuthors});
});

/* 
route              /id
description        specific Author
access             Public
parameters         id
method             get
*/

Router.get("/id/:id", async (req,res) => {
    const requiredAuthor =await AuthorModel.findOne({id : parseInt(req.params.id)});
    if(!requiredAuthor) return res.json({error : "Author not found"});
    return res.json({book : requiredAuthor});
});

/* 
route              s/is/:isbn
description        list of authors for a book
access             Public
parameters         isbn
method             get
*/

Router.get("/is/:isbn", async (req,res) => {
    const requiredAuthor = await AuthorModel.findOne({books : req.params.isbn});
    if(!requiredAuthor) return res.json({error : "Author not found"});
    return res.json({books : requiredAuthor});
});



/* authors Post  --------------------------------------------------------------------------------- */

/* 
route              s/new
description        add new author
access             Public
parameters         category
method             post
*/

Router.post("/new", async(req,res) => {

    const {newAuthor} = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({Authors : newAuthor, result: "Author is added"});

});

/* authors   put --------------------------------------------------------------------------------- */

/* 
route              /update/
description        update name of author
access             Public
parameters         isbn
method             put
*/

Router.put("/update/:id", async (req,res) =>{
    if(!(await AuthorModel.findOne({id : req.params.id}))) return res.json({result : "no author"});
    await AuthorModel.findOneAndUpdate(
        {
            id : req.params.id
        },
        {
            name : req.body.newName
        }
    );
    /*database.Authors.forEach((auth) => {
        if(auth.id=== parseInt(req.params.id)){
            auth.name=req.body.newName;
            return;
        }
    });*/
    return res.json({result : "updated"});
});

module.exports = Router;