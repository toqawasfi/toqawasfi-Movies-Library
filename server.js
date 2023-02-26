'use strict'
const express = require('express');
const cros = require('cors');
const server =express();
const data=require ('./data.json');
const PORT =3000;
function Movielibrary(title,poster_path,overview)
{
    this.title=title;
    this.poster_path= poster_path;
    this.overview=overview;
}
server.get('/',(req,res)=>{
    const movies = new  Movielibrary(data.title,data.poster_path,data.overview);
    res.send(movies);
});
server.get('/favorite',(req,res)=>{
    res.status(200).send("Welcome to Fvourite Pge)")
})
server.get('*',(req,res)=>{
    res.status(500).send("Sorry. something went wrong");
})
server.listen(PORT,() =>{
    console.log(`listening on port ${PORT} IM ready`)
    
})