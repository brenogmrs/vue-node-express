// coloque a sua sting de conexão com o mongodb abaixo caso esteja usando o mongoAtlas
const connString = '';
const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();
// funcao que retorna a conexao com o mongodb

async function loadPostsCollection(){
    const client = await mongodb.MongoClient.connect(connString, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    return client.db('vue-express').collection('posts');
}

// GET POSTS
router.get('/', async (req, res)=>{
    // pega a conexão e a usa para retornar os posts
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

// ADD POSTS
router.post('/', async (req, res) =>{
    // pega a conexão e a usa para inserir novos posts através do insertOne
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date(),
    });

    res.status(201).send();
})

// DELETE POSTS
router.delete('/:id', async (req, res) =>{
    // pega a conexão e a usa para deletar determinado registo passado na url
    // usa o metodo ObjectID para transformar o id em um tipo de id do mongo

    const posts = await loadPostsCollection();
    await posts.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)    
    });
    res.status(200).send();
});


module.exports = router;