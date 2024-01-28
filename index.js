import express from "express";
import {
  getAdmin,
  getFaculty,
  getStaff,
  getDept,
  getAllDepts,
  getAllFaculty,
  getAllStaff,
  updateEntity,
  getEntityById,
  deleteDept,
  deleteFaculty,
  deleteStaff,
  createFaculty,
  createStaff,
  createDept,
} from "./database.js";
import cors from "cors";

const app = express();
app.use(express.json()); // This middleware parses JSON data in the request body

const port = process.env.PORT;

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.post("/:entity", async (req, res) => {
  const entity = req.params.entity;
  let result;
  const { name, phone, extension, email, location, department } = req.body;

  if (entity === "faculty") {
    const faculty = await createFaculty(
      name,
      phone,
      extension,
      email,
      location,
      department
    );
    result = faculty;
  } else if (entity === "staff") {
    const staff = await createStaff(
      name,
      phone,
      extension,
      email,
      location,
      department
    );
    result = staff;
  } else {
    const department = await createDept(
      name,
      phone,
      extension,
      email,
      location
    );
    result = department;
  }
  res.send(result);
});
app.put("/update/:id", async (req, res) => {
  const { id } = req.params; // Get id from URL params
  const { entity, name, phone, extension, email, location, department } =
    req.body; // Use req.body to get parameters from the JSON payload

  let updatedEntity = await updateEntity(id, {
    entity,
    name,
    phone,
    extension,
    email,
    location,
    department,
  });
  res.send(updatedEntity);
});
app.get("/entity/:id/:entity", async (req, res) => {
  const id = req.params.id;
  const entity = req.params.entity;

  let response = await getEntityById(id, entity);
  res.send(response);
});
app.delete("/delete/:entity&:id", async (req, res) => {
  const entity = req.params.entity;
  const id = req.params.id;
  let result;
  if (entity === "faculty") {
    const faculty = await deleteFaculty(id);
    result = faculty;
  } else if (entity === "staff") {
    const staff = await deleteStaff(id);
    result = staff;
  }
  //Departments can't be removed
  res.send(result);
});
app.get("/faculty", async (req, res) => {
  let allFaculty = await getAllFaculty();
  allFaculty = allFaculty;
  res.send(allFaculty);
});
app.get("/depts", async (req, res) => {
  let departments = await getAllDepts();
  res.send(departments);
});
app.get("/staff", async (req, res) => {
  let staff = await getAllStaff();
  res.send(staff);
});
app.get("/faculty/:name", async (req, res) => {
  const name = req.params.name;
  const faculty = await getFaculty(name);
  res.send(faculty);
});
app.get("/staff/:name", async (req, res) => {
  const name = req.params.name;
  const staff = await getStaff(name);
  res.send(staff);
});
app.get("/department/:name", async (req, res) => {
  const name = req.params.name;
  const dept = await getDept(name);
  res.send(dept);
});
app.get("/admin/:username&:password", async (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  const user = await getAdmin(username, password);
  res.send(user);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
