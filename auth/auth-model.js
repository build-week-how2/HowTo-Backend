const db = require("../database/dbConfig");

module.exports = {
  find,
  add,
  findBy,
  findById
};

function find() {
  return db("users").select("id", "username", "password");
}

function findById(id) {
  return db("users")
    .where({ id })
    .first();
}

function findBy(filter) {
  return db("users").where(filter);
}

async function add(user) {
  const [id] = await db("users").insert(user);
  return findById(id);
}
