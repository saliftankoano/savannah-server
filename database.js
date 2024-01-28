import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

// -- CREATE functions --
export async function createFaculty(
  name,
  phone,
  extension,
  email,
  location,
  department
) {
  const faculty = await pool.query(
    `
  INSERT INTO faculty(name, phone, extension, email, location, dept)
  VALUES(?, ?, ?, ?, ?, ?)`,
    [name, phone, extension, email, location, department]
  );
  return faculty[0];
}
export async function createStaff(
  name,
  phone,
  extension,
  email,
  location,
  department
) {
  const staff = await pool.query(
    `
  INSERT INTO staff(name, phone, extension, email, location, dept)
  VALUES(?, ?, ?, ?, ?, ?)`,
    [name, phone, extension, email, location, department]
  );
  return staff[0];
}
export async function createDept(name, phone, extension, email, location) {
  const department = await pool.query(
    `
  INSERT INTO departments(name, phone, extension, email, location)
  VALUES(?, ?, ?, ?, ?)`,
    [name, phone, extension, email, location]
  );
  return department[0];
}

// -- READ functions --
// GET ALL Functions
export async function getAdmin(username, password) {
  const ans = await pool.query(
    `SELECT * FROM admin WHERE username= "${username}" AND password= "${password}";`
  );
  return ans[0];
}
export async function getAllFaculty() {
  const ans = await pool.query("SELECT * FROM faculty;");
  let faculty = ans.slice(0, -1);
  faculty = faculty[0];
  return faculty;
}
export async function getAllStaff() {
  const ans = await pool.query("SELECT * FROM staff;");
  let staff = ans.slice(0, -1);
  staff = staff[0];
  return staff;
}
export async function getAllDepts() {
  try {
    const ans = await pool.query("SELECT * FROM departments");
    const depts = ans[0];

    if (Array.isArray(depts)) {
      return depts;
    } else {
      console.error("Departments data is not an array:", depts);
      return [];
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
}

export async function getFaculty(name) {
  /*
    The name could be entered as just a first name || last name || Full name

    First names have additional letters after them -> ${name}%`
    If results.length == 0 then it's a last name or full name then -> `%${name}%`
  */
  let nameHolder = `${name}%`;
  let faculty = await pool.query("SELECT * FROM faculty WHERE name LIKE ?", [
    nameHolder,
  ]);
  faculty = faculty[0];

  if (faculty.length === 0) {
    nameHolder = `%${name}%`;
    faculty = await pool.query("SELECT * FROM faculty WHERE name LIKE ?", [
      nameHolder,
    ]);
    faculty = faculty[0];
  }
  return faculty[0];
}
export async function getStaff(name) {
  /*
    The name could be entered as just a first name || last name || Full name

    First names have additional letters after them -> ${name}%`
    If results.length == 0 then it's a last name or full name then -> `%${name}%`
  */
  let nameHolder = `${name}%`;
  let staff = await pool.query("SELECT * FROM staff WHERE name LIKE ?", [
    nameHolder,
  ]);
  staff = staff[0];

  if (staff.length === 0) {
    nameHolder = `%${name}%`;
    staff = await pool.query("SELECT * FROM staff WHERE name LIKE ?", [
      nameHolder,
    ]);
    staff = staff[0];
  }
  return staff[0];
}
export async function getDept(name) {
  let nameHolder = `%${name}%`;
  let dept = await pool.query("SELECT * FROM departments WHERE name LIKE ?", [
    nameHolder,
  ]);
  dept = dept[0];
  dept = dept[0];
  return dept;
}
//Get entity by ID
export async function getEntityById(id, entity) {
  const query = `SELECT * FROM ${entity} WHERE id = ?`;
  const queryParams = [id];

  const result = await pool.query(query, queryParams);
  const entityData = result[0][0];

  if (entityData) {
    return entityData;
  } else {
    return { error: "inexistent" }; // Return an error code
  }
}

// -- UPDATE functions --
export async function updateEntity(id, updatedData) {
  const allowedEntities = ["faculty", "departments", "staff"];
  // console.log(updatedData);
  if (
    !updatedData ||
    !updatedData.entity ||
    !allowedEntities.includes(updatedData.entity)
  ) {
    // console.log(updatedData);
  }

  let query = `UPDATE ${updatedData.entity} SET `;
  let queryParams = [];

  if (updatedData.name !== "") {
    if (updatedData.entity !== "departments") {
      query = query.concat(` name= ?,`);
      queryParams.push(updatedData.name);
    }
  }
  if (updatedData.phone !== "") {
    query = query.concat(` phone= ?,`);
    queryParams.push(updatedData.phone);
  }
  if (updatedData.extension !== "") {
    query = query.concat(` extension= ?,`);
    queryParams.push(updatedData.extension);
  }
  if (updatedData.email !== "") {
    query = query.concat(` email= ?,`);
    queryParams.push(updatedData.email);
  }
  if (updatedData.location !== "") {
    query = query.concat(` location= ?,`);
    queryParams.push(updatedData.location);
  }
  if (updatedData.department !== "") {
    if (updatedData.entity !== "departments") {
      query = query.concat(` dept= ?,`);
      queryParams.push(updatedData.department);
    }
  }
  query = query.slice(0, -1); // Remove the trailing comma in the last column specified above
  query = query.concat(` WHERE id= ?`);
  queryParams.push(id);

  let updatedEntity;
  try {
    updatedEntity = await pool.query(query, queryParams);
    return updatedEntity[0][0] || null;
  } catch (error) {
    console.error("Error updating entity:", error.message);
    console.error("Failed to update entity" + updatedEntity);
    return "failed";
  }
}

export async function updateFaculty(
  id,
  name,
  phone,
  extension,
  email,
  location,
  department
) {
  let faculty = pool.query(
    `UPDATE faculty
    SET name= ?, phone= ?, extension= ?, email= ?, location= ?, dept= ?
    WHERE id= ?`,
    [name, phone, extension, email, location, department, id]
  );
  return faculty;
}
export async function updateStaff(
  id,
  name,
  phone,
  extension,
  email,
  location,
  department
) {
  let staff = pool.query(
    `UPDATE staff
    SET name= ?, phone= ?, extension= ?, email= ?, location= ?, dept= ?
    WHERE id= ?`,
    [name, phone, extension, email, location, department, id]
  );
  return staff;
}
export async function updateDept(id, name, phone, extension, email, location) {
  let dept = pool.query(
    `UPDATE departments
    SET name= ?, phone= ?, extension= ?, email= ?, location= ?
    WHERE id= ?`,
    [name, phone, extension, email, location, id]
  );
  return dept;
}
// -- DELETE functions --
export async function deleteFaculty(id) {
  let faculty = pool.query(
    `DELETE FROM faculty
    WHERE id= ?`,
    [id]
  );
  return faculty;
}
export async function deleteStaff(id) {
  let staff = pool.query(
    `DELETE FROM staff
    WHERE id= ?`,
    [id]
  );
  return staff;
}
/*
Due to foreign key constraint deleteDept won't be used
We can implement it properly later if needed.
*/
export async function deleteDept(id) {
  let dept = pool.query(
    `DELETE FROM departments
    WHERE id= ?`,
    [id]
  );
  return dept;
}
