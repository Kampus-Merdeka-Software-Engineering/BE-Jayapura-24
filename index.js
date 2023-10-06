const express = require('express');
const app = express();
const PORT = process.env.PORT||3000;
const bodyParser = require('body-parser');
const {Comment} = require('./models');
const cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors({origin:"*"}))

//menyimpan data
app.post('/comment', async (req, res) => {
    try {
        const body = req.body;
        const username = body.username;
        const parent = body.parent;
        const content = body.content;
        const score = body.score;

        await Comment.create({
            username,
            parent,
            content,
            score,
            image: "user.png",
        });
        return res.send({
            message: 'Data berhasil disimpan',
            status: 200,
        });
    }catch (error) {
        console.log(error)
        return res.status(500).send({
            message: 'Gagal menyimpan data',
        });
    }
});

// Menampilkan data
app.get('/comment', async (req, res) => {
    try {
        const results = await Comment.findAll();
        return res.send({
            messsage: 'Berhasil menampulkan data',
            data: results,
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Gagal menampilkan data',
        });
    }
})

// menghapus data
app.delete('/comment/:id_comment', async (req, res) => {
    try{
        const id = req.params.id_comment;
        await Comment.destroy({
            where: {
                id,
            },
        });
        return res.send({
            message: 'Berhasil menghapus data',
        });
    } catch (error) {
        return res.status(500).send({
            message: 'Gagal menampilkan data',
        });
    }
})
app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`);
});
