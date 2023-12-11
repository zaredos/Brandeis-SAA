module.exports = {
  respondHome: (req, res) => {
    res.render("index");
  },
  showContact: (req, res) => {
    res.render("contacts/contact");
  },
  postedContactForm: (req, res) => {
    res.render("contacts/thanks");
  },
  showAbout: (req, res) => {
    res.render("about");
  },
  chat: (req, res) => {
    res.render("chat");
  },
};
