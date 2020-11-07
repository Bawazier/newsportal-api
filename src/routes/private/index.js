const router = require("express").Router();
const user = require("../../controllers/user");

router.get("/user", user.getUser);
router.patch("/user", user.patchUser);
router.put("/user", user.putUser);
// router.delete("/user", user.deleteUser);

module.exports = router;