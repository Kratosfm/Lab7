const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const jsonParser = bodyParser.json()
const uuidv4 = require('uuid/v4');
app.use(jsonParser)
let posts = [
    {
        id: uuidv4(),
        title: "Post_1",
        content: "Post 1 of 2",
        author: "Francisco Simon",
        publishDate: new Date("23 Marzo 2019")
    },
    {
        id: uuidv4(),
        title: "Post_2",
        content: "Post 2 of 2",
        author: "Francisco Simon",
        publishDate: new Date("24 Marzo 2019")
    }
]

app.get('/blog-posts', (req,res) => {
    res.status(200).json({
        message: "All Post sent",
        status: 200,
        posts: posts
    })
})

app.get('/blog-posts/:author*?', (req,res) => {
    if (!(req.params.author)) {
        res.status(406).json({
            message: `Missing field author in params.`,
            status: 406
        })
    }
    let author = req.params.author
    var match = []
    posts.forEach(function(item,index) {
        if (item.author == author) {
            match.push(item)
        }
    })
    if (match === undefined || match.length == 0) {
        res.status(404).json({
            message: `Author not found`,
            status: 404
        })
    }
    else {
        res.status(200).json({
            message: `Successfully blog post found`,
            posts: match
        })
    }
})
app.post('/blog-posts', (req,res) => {
    let requiredFields = ["title", "content", "author", "publishDate"]
    for (rf of requiredFields) {
        if (!(rf in req.body)) {
            res.status(406).json({
                message: `Missing field in body`,
                status: 406
            })
        }
    }
    let objToAdd = {
        id: uuidv4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate)
    }
    posts.push(objToAdd)
    res.status(201).json({
        message: `Successfully added post.`,
        status: 201,
        postAdded: objToAdd
    })
})

app.delete('/blog-posts/:id*?', (req,res) => {
    if (!(req.params.id)) {
        res.status(406).json({
            message: `Missing field in params.`,
            status: 406
        })
    }
    if (!("id" in req.body)) {
        res.status(406).json({
            message: `Missing field in body.`,
            status: 406
        })
    }

    if (req.params.id != req.body.id) {
        return res.status(409).json({
            message: `ID '${req.body.id}' in body different than ID '${req.params.id}' in params.`,
            status: 409
        }).send("Finish")
    }

    let id = req.params.id
    posts.forEach(function(item,index) {
        if (id == item.id) {
            posts.splice(index,1)
            return res.status(200).json({
                message: `successfully deleted`,
                status: 200
            })
        }
    })

    res.status(404).json({
        message: `Post not exist`,
        status: 404
    })
})

app.put('/blog-posts/:id*?', (req,res) => {
    if (!(req.params.id)) {
        res.status(406).json({
            message: `Missing field id`,
            status: 406
        })
    }
    let id = req.params.id
    if (req.body.length == 0) {
        res.status(404).json({
            message: `Empty body`,
            status: 404
        }).send("Finish")
    }

    posts.forEach(item => {
        if (item.id == id) {
            empty = true
            for (let key in req.body) {
                if (key == 'title' || key == 'content' || key == 'author') {
                    item[key] = req.body[key]
                    empty = false
                }
                else if (key == 'publishDate') {
                    item[key] = new Date(req.body[key])
                    empty = false
                }
            }
            if (empty) {
                return res.status(404).json({
                    message: `Empty body.`,
                    status: 404
                }).send("Finish")
            }
            else
                res.status(200).json({
                    message: `Post updated.`,
                    status: 200
                }).send("Finish")
        }
    })

    res.status(404).json({
        message: `Post not exist`,
        status: 404
    })
})

app.listen(8080, () => {
    console.log(`Your app is running in port 8080`)
})
