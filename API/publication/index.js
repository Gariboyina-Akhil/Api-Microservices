const Router = require("express").Router()

const PublicationModel = require("../../database/publication");

/* publications get  --------------------------------------------------------------------------------- */

/* 
route              /
description        list of publication
access             Public
parameters         None
method             get
*/

Router.get("/", async (req,res) => {
    const requiredPublication = await PublicationModel.find()
    return res.json({publications : requiredPublication});
});

/* publication Post  --------------------------------------------------------------------------------- */

/* 
route              /new
description        add new publicstion
access             Public
parameters         category
method             post
*/

Router.post("/new", (req,res) => {

    const {newPub} = req.body;
    const addNewPublication = PublicationModel.create(newPub)
    return res.json({publications : addNewPublication, result: "publication is added"});

});

/* publication   put --------------------------------------------------------------------------------- */

/* 
route              /name/update
description        update title of a book
access             Public
parameters         id
method             put
*/

Router.put("/name/update/:id", async (req,res) =>{
    const updatedPubliication = await PublicationModel.findOneAndUpdate({
        id : req.params.id
    },{
        name : req.body.newName
    },{
        new : true
    });
    /*database.publications.forEach((pub) => {
        if(pub.id=== parseInt(req.params.id)){
            pub.name=req.body.newName;
            return;
        }
    });*/
    return res.json({publications : updatedPubliication});
});


module.exports = Router;