const Event = require("../models/event");
const User = require("../models/user");

module.exports = {
  
  index: (req, res, next) => {
    Event.find()
      .then((events) => {
        res.locals.events = events;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching events: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    //res.render("events/index");
    //res.json(res.locals.events);
    if (req.query.format === "json") {
      res.json(res.locals.events);
    } else {
      res.render("events/index");
    }
  },
  new: (req, res) => {
    res.render("events/new");
  },
  create: (req, res, next) => {
    let eventParams = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      isOnline: req.body.isOnline == "on" ? true : false,
      registrationLink: req.body.registrationLink,
      organizer: req.user, // Organizer is the current user (who created it)
      attendees: [] // Leave attendees empty for now, add when user enrolls
    };
    Event.create(eventParams)
      .then((event) => {
        res.locals.redirect = "/events";
        res.locals.event = event;
        next();
      })
      .catch((error) => {
        console.log(`Error saving event: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let eventId = req.params.id;
    Event.findById(eventId)
      .then((event) => {
        res.locals.event = event;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("events/show");
  },
  edit: (req, res, next) => {
    let eventId = req.params.id;
    Event.findById(eventId)
      .then((event) => {
        res.render("events/edit", {
          event: event,
        });
      })
      .catch((error) => {
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let eventId = req.params.id;
    let isAdmin = req.user.isAdmin;

    Event.findById(eventId)
      .then((event) => {
        if (event.organizer.equals(userId) || isAdmin) { // Only can update if user is organizer or admin
          let eventParams = {
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            isOnline: req.body.isOnline == "on" ? true : false,
            registrationLink: req.body.registrationLink,
            organizer: event.organizer,
            attendees: event.attendees,
          };

          Event.findByIdAndUpdate(eventId, {
            $set: eventParams,
          })
            .then((updatedEvent) => {
              res.locals.redirect = `/events/${eventId}`;
              res.locals.event = updatedEvent;
              next();
            })
            .catch((error) => {
              console.log(`Error updating event by ID: ${error.message}`);
              next(error);
            });
        } else {
          res.redirect(`/events/${eventId}`);
        }
      })
      .catch((error) => {
        console.log(`Error finding event by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let eventId = req.params.id;
    let isAdmin = req.user.isAdmin;
    if (isAdmin) { // Only allow admin to delete event
      Event.findByIdAndRemove(eventId)
        .then(() => {
          res.locals.redirect = "/events";
          next();
        })
        .catch((error) => {
          console.log(`Error deleting event by ID: ${error.message}`);
          next();
        });
    } else {
      res.redirect(`/events/${eventId}`);
      console.log('You are not authorized to delete this event')
    }
  },
  attend: (req, res, next) => {
    let eventId = req.params.id;
    let user = req.user;
    Event.findById(eventId)
      .then((event) => {
        if (event.attendees.includes(user)) { // Dont allow user to enroll twice
          console.log("User already enrolled");
          res.locals.redirect = `/events/${eventId}`;
          res.locals.event = event;
          next();
        } else {
          Event.findByIdAndUpdate(eventId, {
            $push: { attendees: user },
          })
            .then((updatedEvent) => {
              res.locals.redirect = `/events/${eventId}`;
              res.locals.event = updatedEvent;
              next();
            })
            .catch((error) => {
              console.log(`Error enrolling user to event: ${error.message}`);
              next(error);
            });
        }
      })
      .catch((error) => {
        console.log(`Error finding event by ID: ${error.message}`);
        next(error);
      });
  },
};
