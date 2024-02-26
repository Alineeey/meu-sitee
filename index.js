const express = require("express");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const TodoTask = require("./models/TodoTask");

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  TodoTask.find({}).then((tasks) => {
    res.render("App.ejs", { todoTasks: tasks });
  });
});

app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndDelete(id).then((_,err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  })
});

const mongoose = require("mongoose");

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }).then(() => {
  console.log("Connected to db!");

  app.listen(3000, () => console.log("Server Up and running"));
});
