const inquirer = require("inquirer");

const db = require("./db/connection.js"); //{multiples funciones}

//  view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

async function viewAllDepartments() {
  const [result] = await db.promise().query("SELECT * FROM department");
  console.table(result);
}

async function viewAllRoles() {
  const [result] = await db
    .promise()
    .query(
      "SELECT role.id, title, salary, department_id, department.name AS deparment_name FROM role JOIN department ON role.department_id = department.id"
    );
  console.table(result);
}

async function viewAllEmployees() {
  const [result] = await db.promise().query("SELECT * FROM employee");
  console.table(result);
}

async function addDepartment() {
  const department = await inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the department?",
      name: "name",
    },
  ]);

  await db.promise().query("INSERT INTO department SET ?", department);
}

async function addRole() {
  const [departments] = await db.promise().query("SELECT * FROM department");

  const role = await inquirer.prompt([
    {
      type: "input",
      message: "What is the title of this role?",
      name: "title",
    },
    {
      type: "number",
      message: "What is the salary of this role?",
      name: "salary",
    },
    {
      type: "list",
      message: "What is the department of this role?",
      name: "department_id",
      choices: departments.map((department) => {
        return {
          name: department.name,
          value: department.id,
        };
      }),
    },
  ]);
  await db.promise().query("INSERT INTO role SET ?", role);
}

async function addEmployee() {
  const [employees] = await db.promise().query("SELECT * FROM employee");

  const role = await inquirer.prompt([
    {
      type: "input",
      message: "Enter first name",
      name: "first_name",
    },
    {
      type: "number",
      message: "Enter last name?",
      name: "last_name",
    },
    {
      type: "list",
      message: "What is the department of this employee?",
      name: "department_id",
      choices: employees.map((department_id) => {
        return {
          name: department.name,
          value: department.id,
        };
      }),
    },
  ]);
  await db.promise().query("INSERT INTO employee SET ?", employee);
}

async function updateEmployeeRole() {}

// viewAllDepartments();
// viewAllRoles();
// viewAllEmployees();
// addDepartment().then(viewAllDepartments);
// addRole().then(viewAllRoles);
addEmployee();

// complete the last 2 functions
// add one last function that lets the user select which function to run
