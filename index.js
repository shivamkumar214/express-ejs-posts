const express= require("express"); 
const app=express();
const port=8080;
const path=require("path");

// we have installed uuid from npm so that we can get unique id for every post
const { v4: uuidv4 } = require('uuid');

// we have to install method-override package so that we override the text or delete it (DELETE/PATCH/PUT) 
const methodOverride=require('method-override');
app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true})); //now express can understand hidden url data

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));

//1st
let posts=[
    {
        id:uuidv4(), //uuidv4 return unique id evertime
        username:"shivam",
        content: "shivam's 1st project"
    },
    {
        id:uuidv4(),
        username:"you can add your posts",
        content:"just click below on create a new post "
    },
    {
        id:uuidv4(),
        username: "you can get post in detail",
        content:"just click below on see more details"
    }
];

// create index.ejs file in views folder and pass data to index.ejs 
// code to pass the posts data to index.ejs 
app.get("/posts", (req,res)=>{
    res.render("index.ejs",{posts: posts});
});
// post in above code is used so that posts go to index.ejs file [Note point]

// this will execute when form has get method and form data store in req.query
app.get("/posts/new", (req,res)=>{
    res.render("new.ejs");
});

// In case of post method form only this code exexute and form data store in req.body
app.post("/posts", (req,res)=>{
    let { username, content } = req.body;

    if (username.length < 1 || content.length < 2) {
        return res.send(
            `<script>
             alert("Length of Username should be greater then 1 and Length of Content must be at least 2 characters long!");
             window.location.href="/posts/new";
            </script>`
        );
    }

    let id=uuidv4();

    // this data inserted in posts array
    posts.push({ id, username, content });
    
    console.log(`${username} This is username ${content} and id is ${id}`);

    // redirect your page to /posts site 
    res.redirect("/posts");
});

// get details using ID;
app.get("/posts/:id", (req,res)=>{
    let {id} = req.params;
    let post = posts.find((p) => id===p.id);
    console.log(post);
    res.render("show.ejs", { post }); 
});


app.get("/posts/:id/edit", (req,res)=>{
    let {id} = req.params;
    let post = posts.find((p) => id===p.id);
    console.log(post);
    res.render("edit.ejs",{ post });
});

// method-override package redirect to this code 
app.patch("/posts/:id", (req,res)=>{
    let {id} = req.params;

    // content is hiden because form method is post
    let newContent = req.body.content;

    if (newContent.length < 2) {
        return res.send(`<script> alert("Content must be at least 2 characters long!"); window.location.href="/posts/${id}/edit"; </script>`);
    }
   
     // we have to find complete detail of that post.
    let post = posts.find((p) => id===p.id);
    console.log(post);
    post.content = newContent;
    res.redirect("/posts");
   
});


// delete the post 
app.delete("/posts/:id", (req,res)=>{
   let {id} =req.params; 

//    filter function is use to create an array of defined condition , all post goes in posts whose id not equal to 
// url id 
   posts=posts.filter((p)=>id !== p.id);
   res.redirect("/posts");
});

app.listen(port, ()=>{
    console.log("Hey Dear, I am listening you!!!!");
});