const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const uniqid = require('uniqid');
const methodOverride = require('method-override')

const Product = require("./models/product")

mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
	console.log("Mongo Connection achieved");
}).catch((err) => {
	console.log("MONGO CONNECTION ERRROR: " + err);
})

app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs")

const categories = ["fruit", "vegetable", "dairy", "mushrooms"]

app.get("/products", async(req,res) => {
	const {category} = req.query;
	if(category){
		const products = await Product.find({category: category});	
		res.render("products/index", {products, category})
	}else{
		const products = await Product.find({});
		res.render("products/index", {products, category: "ALL"})
	}
})

app.get("/products/new", (req,res) => {
	res.render("products/new", {categories});
})

app.get("/products/:id", async(req,res) => {
	try{
		const {id} = req.params;
		const foundProduct = await Product.findById(id);
		res.render("products/show", {foundProduct})
	}
	catch(err) {
		console.log(err)
	}
})

app.get("/products/:id/edit", async(req,res) => {
	const {id} = req.params
	const foundProduct = await Product.findById(id)
	res.render("products/update", {foundProduct, categories})
})
// FILTER BY CATEGORIES
// app.get("/products")

// CREATE
app.post("/products", async(req,res) => {
	try{
		const newProduct = new Product(req.body)
		await newProduct.save();
		console.log(newProduct)
		res.redirect(`/products/${newProduct._id}`)
	}catch(err){
		console.log(err)
	}
})
// UPDATE
app.put("/products/:id", async(req,res) => {
	const {id} = req.params
	const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
	console.log(updatedProduct);
	res.redirect(`/products/${updatedProduct._id}`)
})
// DELETE
app.delete("/products/:id", async(req,res)=> {
	const {id} = req.params
	const deletedProduct = await Product.findByIdAndDelete(id);
	console.log(deletedProduct)
	res.redirect("/products")
})



app.listen(3000, function(){
	console.log("SERVER RUNNING ON PORT 3000")
})