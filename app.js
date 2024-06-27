import { log } from "console";
import express from "express";
import * as fs from "fs";
const app = express();

app.get("/employee/:id", (req, res) => {
  const { id } = req.params;
  const emps = JSON.parse(fs.readFileSync("employees.json"));
  const emp = emps.find((emp) => {
    return emp.employee_id == id;
  });

  if (emp) {
    res.status(200).json(emp);
  }
  res.status(404).json({ msg: "emp not found" });
});

app.get("/project/:id", (req, res) => {
  const { id } = req.params;
  const projects = JSON.parse(fs.readFileSync("projects.json"));
  const project = projects.find((project) => {
    return project.project_id == id;
  });

  if (project) {
    res.status(200).json(project);
  }
  res.status(404).json({ msg: "project not found" });
});

app.get("/getemployeedetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const empResponse = await fetch(`http://localhost:3100/employee/${id}`);
    const emp = await empResponse.json();
    const projectResponse = await fetch(
      `http://localhost:3100/employee/${emp.project_id}`
    );
    const project = await projectResponse.json();
    if (!project || !emp) return res.status(500).json("not found");
    res.status(200).json({ emp, project });
  } catch (error) {
    res.status(500).json("something went wrong");
  }
});

app.get("/api/employees", (req, res) => {
  fetch("http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees")
    .then((response) => response.json())
    .then((emps) => {
      if (emps.length > 0) {
        const new_emps = emps.map((emp) => {
          const nemp = {
            name: emp.name,
            id: emp.id,
            createdAt: emp.createdAt,
          };

          return nemp;
        });
        res.status(200).json(new_emps);
      }
    });
});

app.listen(3100, () => {
  console.log("server running on port 3100");
});
