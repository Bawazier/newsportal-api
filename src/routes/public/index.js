const router = require("express").Router();
const main = require("../../controllers/main");

router.get("/details/news/:id", main.detailsNews);
router.get("/search/news", main.searchNews);
router.get("/search/trends", main.searchTrends);
router.get("/topics", main.findTopics);
router.get("/news/topics/:id", main.findNewsByTopics);

module.exports = router;