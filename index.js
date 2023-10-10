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
        return res.status(500).send({
            message: 'Gagal menyimpan data',
        });
    }
});

// Menampilkan data
app.get('/comment', async (req, res) => {
    try {
        const results = await Comment.findAll();
        const arr = results.map((result) => ({
            id: result.id,
            parent: result.parent == 0 ? null : parseInt(result.parent),
            username: result.username,
            content: result.content,
            image: result.image,
            score: result.score,
        }))
        const items = getNestedChildren(arr);
        return res.send({
            messsage: 'Berhasil menampulkan data',
            results: items,
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

function getNestedChildren(arr, parent) {
    const out = [];
    for (const i in arr) {
        if (arr[i].parent === parent) {
            const children = getNestedChildren(arr, arr[i].id);

            if (children.length) {
                arr[i].replies = children;
            }
            out.push(arr[i]);
        }
    }
    return out;
}