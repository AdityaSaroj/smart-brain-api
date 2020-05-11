const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      }
    })
    .catch((err) => res.status(400).json("User not found."));
};

module.exports = {
  handleProfileGet: handleProfileGet,
};
