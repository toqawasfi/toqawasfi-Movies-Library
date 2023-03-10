'use strict'
const express = require('express');
const cors = require('cors');
const server = express();
const data = require('./data.json');
const axios = require('axios');
require('dotenv').config();
const pg= require('pg');

server.use(cors());
server.use(express.json());

const PORT = process .env.PORT || 3000;
const client=new pg.Client(process.env.DATABASE_URL);
function Movielibrary(id,title,release_date,summary,poster_path, overview) {
     this.id=id,
    this.title = title;
    this.release_date = release_date,
    this.summary = summary,
    this.poster_path = poster_path;
    this.overview = overview;
}
server.get('/', (req, res) => {
    const movies = new Movielibrary(data.title, data.poster_path, data.overview);
    res.send(movies);
});
server.get('/favorite', (req, res) => {
    res.status(200).send("Welcome to Fvourite Pge)")
})

server.get('/trending',moviesHandler)
server.get('/search',searchHandler)
server.post('/addMovie',addmoviesHandler)
server.get('/getMovies',getMoviesHandler)
// server.put('/getMovies/:id',updateMovie)
server.put('/getMovies/:id',updateMovies)
server.delete('/getMovies/:id',deleteMovies)
server.get('/getMovies/:id',geteMovies)
server.get('*', (req, res) => {
    res.status(500).send("Sorry. something went wrong");
})
server.use(errorHandler); //use middleware function

function moviesHandler(req, res) {
    const APIKey = process.env.APIKey;
const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`;
axios.get(url)
.then((result) => {
    //code depends on axios result
    console.log("axios result");
})

    let mapResult = result.data.results.map((item) => {
        let movie = new Movielibrary(item.id, item.title, item.release_date, item.summary,poster_path,overview);
        return movie;
    })
    res.send(mapResult);
    console.log("hi");
}
function searchHandler(req,res)
{
const url1=`https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`;
axios.get(url)
.then((result) => {
    //code depends on axios result
    console.log("axios result");
})
}
function getMoviesHandler(req,res)
{
    //get all data from DB
    const sql = `SELECT * FROM favmovies;`
    client.query(sql)
    .then((data)=>{
        res.send(data.rows);
    })
    .catch((err)=>{
        errorHandler(err,req,res);
    })
}
function addmoviesHandler(req,res)
{
    const movie = req.body; 
    console.log(movie);
    const sql = `INSERT INTO favmovies (title,summary) VALUES ($1,$2) RETURNING *;`
    const values = [movie.title, movie.summary];
    console.log(sql);

    client.query(sql,values)
    .then((data) => {
        res.send("your data was added !");
    })
        .catch(error => {
            // console.log(error);
            errorHandler(error, req, res);
        });
 //updating movies using path parameters(id)       
}
function updateMovies(req,res){
    const id = req.params.id;
    console.log(id);
    console.log(req.body);
    const sql = `UPDATE favmovies SET title=$1, summary=$2 WHERE id=${id} RETURNING *`;
    const values = [req.body.title,req.body.summary];
    client.query(sql,values)
    .then((data)=>{
        res.status(200).send(data.rows);
    })
    .catch((err)=>{
        errorHandler(err,req,res);
    })
}
//deleting movies using id
function deleteMovies(req,res){
    const id = req.params.id;
    const sql = `DELETE FROM favmovies WHERE id=${id}`;
    client.query(sql)
    .then((data)=>{
        res.status(200).send(data.rows);
    })
    .catch((err)=>{
        errorHandler(err,req,res);
    })

}
// getting movies usig id
function geteMovies(req,res)
{
    const id = req.params.id; 
    const sql = `SELECT * FROM favmovies WHERE id=${id}`;
    // const values = [req.body.title,req.body.summary]; must be in header
    client.query(sql)
    .then((data) => {
        res.send(data.rows);
    })
        .catch(error => {
            // console.log(error);
            errorHandler(error, req, res);
        });
}
function errorHandler(erorr, req, res) {
    const err = {
        status: 500,
        massage: erorr
    }
    res.status(500).send(err);
}
client.connect()
.then(()=>{
server.listen(PORT, () => {
    console.log(`listening on port ${PORT} IM ready`);

});
})
