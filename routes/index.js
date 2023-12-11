const router = require("express").Router();

const userRoutes = require("./userRoutes"),
  jobRoutes = require("./jobRoutes"),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes");
  eventRoutes = require("./eventRoutes");

router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/events", eventRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;
