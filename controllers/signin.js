const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!email || !password) {
    return res.status(400).json("Couldn't signin.");
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to get user."));
      } else {
        res.status(400).json("Incorrect email or password");
      }
    })
    .catch((err) => res.status(400).json("Couldn't signin."));
};

module.exports = {
  handleSignin: handleSignin,
};
