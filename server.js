'use strict'
const express = require('express');
const cors = require('cors');
const server = express();
const data = require('./data.json');
const axios = require('axios');
require('dotenv').config();
server.use(cors());
const PORT = 3000;
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
server.get('/trending',moviesHandler)
server.get('/search',searchHandler)
server.get('/favorite', (req, res) => {
    res.status(200).send("Welcome to Fvourite Pge)")
})
server.get('*', (req, res) => {
    res.status(500).send("Sorry. something went wrong");
})



function moviesHandler(req, res) {
    try{
        const APIKey = process.env.APIKey;
        const url =`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`
         axios.get(url)//send req to API
        // console.log(axres.data); //always will put result inside of data var
        // res.send(axres.data.results);
        .then((axres)=>{
              //code depends on axios result
              let mapResult = axres.data.results.map((item) => {
                let movie = new Movielibrary(item.id, item.title, item.release_date, item.summary,item.poster_path,item.overview);
                return movie;
        })
        
        res.send(mapResult);
        })
        .catch((err) => {
            console.log("sorry", err);
            res.status(500).send(err);
        })
         }
         catch (error) {
            errorHandler(error,req,res);
        }
        }

function searchHandler(req,res)
{
    try{
        const APIKey = process.env.APIKey;
const url=`https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`
axios.get(url)
.then((result) => {
    //code depends on axios result
    console.log("axios result");
    let searchResult = result.data.results;
    console.log()
    res.send(searchResult);
})
.catch((err) => {
    console.log("sorry", err);
    res.status(500).send(err);
})
 }
 catch (error) {
    errorHandler(error,req,res);
}

}
server.listen(PORT, () => {
    console.log(`listening on port ${PORT} IM ready`)

})