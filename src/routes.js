import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .writeHead(400, "Falha na requisição")
          .end("Corpo da requisição incompleto");
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: null,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const taskFound = database.selectOne("tasks", id);

      if (!taskFound) {
        return res.writeHead(200, "sucesso").end("Registro não encontrado");
      }

      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .writeHead(400, "Falha na requisição")
          .end("Corpo da requisição incompleto");
      }

      database.update("tasks", id, {
        ...taskFound,
        title,
        description,
        updated_at: new Date().toISOString(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      const taskFound = database.selectOne("tasks", id);

      if (!taskFound) {
        return res.writeHead(200, "sucesso").end("Registro não encontrado");
      }

      const completed_at = taskFound?.completed_at
        ? null
        : new Date().toISOString();

      database.update("tasks", id, {
        ...taskFound,
        completed_at,
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const taskFound = database.selectOne("tasks", id);

      if (!taskFound) {
        return res.writeHead(200, "sucesso").end("Registro não encontrado");
      }

      database.delete("tasks", id);
      7;

      return res.writeHead(204).end();
    },
  },
];
