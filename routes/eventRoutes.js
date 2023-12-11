const router = require("express").Router();
const eventsController = require("../controllers/eventsController");

router.get("/", eventsController.index, eventsController.indexView);
router.get("/new", eventsController.new);
router.post(
  "/create",
  eventsController.create,
  eventsController.redirectView
);
router.get("/:id", eventsController.show, eventsController.showView);
router.get("/:id/edit", eventsController.edit);
router.put(
  "/:id/update",
  eventsController.update,
  eventsController.redirectView
);
router.get("/:id/attend", eventsController.attend, eventsController.redirectView);
router.delete(
  "/:id/delete",
  eventsController.delete,
  eventsController.redirectView
);

module.exports = router;
