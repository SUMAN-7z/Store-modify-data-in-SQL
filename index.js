const { faker } = require(`@faker-js/faker`);
const mysql = require(`mysql2`);
const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "Delta_app",
  password: "8144975283@Suman"
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
};


//root directory "/" to see home page
app.get("/", (req, res) => {
  let q = `select count(*) from user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch {
    console.log(err);
    console.log("some error in database");
  };
});

//show Route to see all user data "/user"

app.get("/user", (req, res) => {
  let q = `select * from user`;

  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", { users });
    });
  } catch {
    console.log(err);
    console.log("some error in database");
  };
});


//edit route to edit user data

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch {
    console.log(err);
    console.log("some error in database");
  };
});

//update rout in DATA_BASE

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `select * from user where id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong Password");
      } else {
        let q2 = `UPDATE USER SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      };
    });
  } catch {
    console.log(err);
    console.log("some error in database");
  };
});

//Delete Route to delete user data

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("deleteUser.ejs", { user });
    });
  } catch {
    console.log(err);
    console.log("some error in database");
  };
});

//Delete the user  from DATA_BASE

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `select * from user where id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong Password");
      } else {
        let q2 = `DELETE FROM user WHERE password='${formPass}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      };
    });
  } catch {
    console.log(err);
    console.log("some error in database");
  };
});

//Add New User to DATA_BASER

app.get("/user/join", (req, res) => {
  res.render("clickToJoin.ejs");
});
app.post("/user/join", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();
  let q = `insert into user (id,username,email,password) values ('${id}','${username}','${email}','${password}')`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error occured");
  }
});


app.listen(8080, () => {
  console.log("server is listenting to port 8080 :");
});
