
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
const date=require(__dirname+"/date.js");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
//var items=["Buy Food","Cook Food","Eat Food"];
//let workItems=[];
mongoose.connect("mongodb+srv://sumit_pate:root@cluster0.8r4ve7j.mongodb.net/todolistDB",{useNewUrlParser:true});
const itemsSchema = {
  name:String
};
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
  name:"Welcome to your todolist!"
});
const item2=new Item({
  name:"Hit the + button to add a new item."
});
const item3=new Item({
  name:"<-- Hit this to delete an item."
});
const defaultItems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemsSchema]
};
const List=mongoose.model("List",listSchema);



app.get("/",function(req,res)
{

   Item.find({})
   .then(function(foundItems)
   {
     if(foundItems.length===0)
     {
       Item.insertMany(defaultItems)
       .then(function()
       {
         console.log("Successfully saved default items to DB");
       })
       .catch(function(err)
       {
         console.log(err);
       })
       res.redirect("/");
     }
     else
     {
       res.render("list",{newListItems:foundItems,listTitle:"Today"});
     }

   })
   .catch(function(err)
   {
     console.log(err);
   })

})



app.post("/delete",function(req,res)
{
  const checkedItemId=req.body.checkbox;
  const listName=req.body.listName;
  console.log(listName);
  if(listName==="Today")
  {
    Item.findByIdAndRemove(checkedItemId)
    .then(function()
  {
    res.redirect("/");
    console.log("Successfully deleted the items");
  })
  .catch(function(err)
  {
    console.log(err);
  })

  }
  else
  {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
    .then(function(foundList)
  {
    res.redirect("/"+listName);
    console.log("Successfully deleted the items");
  })
  .catch(function(err)
{
  console.log(err);
})
  }




})



app.get("/:customListName",function(req,res)
{
  const customListName=req.params.customListName;
  console.log(customListName);

  List.findOne({name:customListName})
  .then(function(foundList)
{
  if(!foundList)
  {
    //Crate a new list
    const list=new List({
      name:customListName,
      items:defaultItems
    });
    list.save();
    res.redirect("/"+customListName);
  }
  else
  {



    //show an existing listTitle
   res.render("list",{newListItems:foundList.items,listTitle:customListName})
  }
})
.catch(function(err)
{
  console.log(err);
})

})


app.post("/",function(req,res)
{
    const itemName=req.body.newItem;
    const listName=req.body.list;
    const item=new Item({
      name:itemName
    });
    console.log(listName);
    if(listName==="Today")
    {
      item.save();
      res.redirect("/");
    }
    else
    {
      List.findOne({name:listName})
      .then(function(foundList)
    {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    })
    }

})





let port=process.env.PORT;
if(port==null || port=="")
{
  port=3000;
}


app.listen(port,function(req,res)
{
  console.log("server is runnig on port 3000");
})
