const express = require('express');
const router = express.Router();
const Article = require('./../models/article');

router.get('/', async (req, res) => {
    let articles = await Article.find({}).sort({ createdAt: 'desc' });
    articles = articles.map(a => a.toJSON());
    res.render('articles/index', { articles, layout: false })
});

router.get('/new', (req, res) => {
    res.render('articles/new', { article: new Article, layout: false })
});

router.get('/edit/:id', async (req, res) => {
    let id = req.params.id;
    console.log(id)
    try {
        let article = await Article.findById(req.params.id);
        console.log(article)
        article = article.toJSON();
        res.render('articles/edit', { article, layout: false })
    } catch (err) {
        console.log(err)
    }
});

router.get('/:slug', async (req, res) => {
    let slug = req.params.slug;
    console.log(slug)
    let article = await Article.findOne({ slug: slug });
    article = article.toJSON()
    if (article == null) res.redirect('/articles/');
    res.render('articles/show', { article: article, layout: false });
})

router.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect('new'));

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    console.log (req.article)
    next();
}, saveArticleAndRedirect('edit'));

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/articles');
});

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try {
            article = await article.save();
            res.redirect(`/articles/${article.slug}`)
        } catch (err) {
            res.render(`/articles/${path}`, { article, layout: false })
        }
    }
};


module.exports = router;