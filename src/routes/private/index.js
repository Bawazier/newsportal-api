const router = require("express").Router();
const user = require("../../controllers/user");
const news = require("../../controllers/news");

router.get("/user", user.getUser);
router.patch("/user", user.patchUser);
router.put("/user", user.putUser);
// router.delete("/user", user.deleteUser);

router.get("/news", news.getNews);
router.post("/news", news.postNews);
router.patch("/news/:id", news.patchNews);
router.put("/news/:id", news.getNews);
router.delete("/news/:id", news.deleteNews);

module.exports = router;