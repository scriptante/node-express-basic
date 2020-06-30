const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validatedId(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }
  request.index = repositoryIndex;
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  response.json(repository);
});

app.use("/repositories/:id", validatedId);

app.put("/repositories/:id", (request, response) => {
  const { index } = request;
  const { title, url, techs } = request.body;
  repositories[index].title = title ? title : repositories[index].title;
  repositories[index].url = url ? url : repositories[index].url;
  repositories[index].techs = techs ? techs : repositories[index].techs;
  response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { index } = request;
  repositories.splice(index, 1);
  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { index } = request;
  repositories[index].likes = repositories[index].likes + 1;
  response.json(repositories[index]);
});

module.exports = app;
