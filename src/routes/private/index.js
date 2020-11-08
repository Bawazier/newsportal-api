const router = require("express").Router();
const user = require("../../controllers/user");
const news = require("../../controllers/news");
const favorite = require("../../controllers/favorite");
const topics = require("../../controllers/topics");

router.get("/user", user.getUser);
router.patch("/user", user.patchUser);
router.put("/user", user.putUser);
// router.delete("/user", user.deleteUser);

router.get("/news", news.getNews);
router.post("/news", news.postNews);
router.patch("/news/:id", news.patchNews);
router.put("/news/:id", news.getNews);
router.delete("/news/:id", news.deleteNews);

router.get("/favorite", favorite.getFavorite);
router.post("/favorite/:id", favorite.postFavorite);
router.delete("/favorite/:id", favorite.deleteFavorite);

router.get("/topics", topics.getTopics);
router.post("/topics", topics.postTopics);
router.patch("/topics/:id", topics.patchTopics);
router.put("/topics/:id", topics.putTopics);
router.delete("/topics/:id", topics.deleteTopics);

module.exports = router;