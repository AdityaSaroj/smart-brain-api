const handleRegister = (req, res, db, bcrypt) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json("Please fill all fields");
  }

  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return db("users")
          .returning("*")
          .insert({
            email: email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("This user is already registered."));
};

module.exports = {
  handleRegister: handleRegister,
};
