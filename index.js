const inquirer = require("inquirer"); // Prompts
const cTable = require("console.table"); // View in table format

const db = require("./db/connection.js"); //{multiples funciones}

//  view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

async function viewAllDepartments() {
  const [result] = await db.promise().query("SELECT * FROM department");
  console.table(result);
  menu();
}

async function viewAllRoles() {
  const [result] = await db
    .promise()
    .query(
      "SELECT role.id, title, salary, department_id, department.name AS deparment_name FROM role JOIN department ON role.department_id = department.id"
    );
  console.table(result);
  menu();
}

async function viewAllEmployees() {
  const [result] = await db.promise().query("SELECT * FROM employee");
  console.table(result);
  menu();
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
  menu();
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
  menu();
}

async function addEmployee() {
  const [employees] = await db.promise().query("SELECT * FROM employee");
  const [roles] = await db.promise().query("SELECT * FROM role");

  const employee = await inquirer.prompt([
    {
      type: "input",
      message: "Enter first name",
      name: "first_name",
    },
    {
      type: "input",
      message: "Enter last name?",
      name: "last_name",
    },
    {
      type: "list",
      message: "What is the role of this employee?",
      name: "role_id",
      choices: roles.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      }),
    },
    {
      type: "list",
      message: "What is the manager of this employee?",
      name: "manager_id",
      choices: employees.map((emp) => {
        return {
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        };
      }),
    },
  ]);

  await db.promise().query("INSERT INTO employee SET ?", employee);
  console.log("Employee added successfully!");
  menu();
}

// UPDATE EMPLOYEE ROLE
async function updateEmployeeRole() {
  // Fetch the list of employees from the database
  const [employees] = await db.promise().query("SELECT * FROM employee");

  // Prompt the user to select an employee from the list
  const chosenEmployee = await inquirer.prompt([
    {
      type: "list",
      message: "Select an employee to update their role:",
      name: "employee_id",
      choices: employees.map((emp) => {
        return {
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        };
      }),
    },
  ]);

  // Fetch the list of roles from the database
  const [roles] = await db.promise().query("SELECT * FROM role");

  // Prompt the user to select a new role for the chosen employee
  const newRole = await inquirer.prompt([
    {
      type: "list",
      message: "Select a new role for the employee:",
      name: "role_id",
      choices: roles.map((role) => {
        return {
          name: role.title,
          value: role.id,
        };
      }),
    },
  ]);

  // Update the employee's role in the database
  await db
    .promise()
    .query("UPDATE employee SET role_id = ? WHERE id = ?", [
      newRole.role_id,
      chosenEmployee.employee_id,
    ]);

  console.log("Employee role updated successfully!");
  menu();
}

async function updateEmployeeManager() {
  // Fetch the list of employees from the database
  const [employees] = await db.promise().query("SELECT * FROM employee");

  // Prompt the user to select an employee from the list
  const chosenEmployee = await inquirer.prompt([
    {
      type: "list",
      message: "Select an employee to update their manager:",
      name: "employee_id",
      choices: employees.map((emp) => {
        return {
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        };
      }),
    },
  ]);

  // Prompt the user to select a new manager for the chosen employee
  const newManager = await inquirer.prompt([
    {
      type: "list",
      message: "Select a new manager for the employee:",
      name: "manager_id",
      choices: employees.map((emp) => {
        return {
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        };
      }),
    },
  ]);

  // Update the employee's manager in the database
  await db
    .promise()
    .query("UPDATE employee SET manager_id = ? WHERE id = ?", [
      newManager.manager_id,
      chosenEmployee.employee_id,
    ]);

  console.log("Employee manager updated successfully!");
  menu();
}

// Exit the application via menu
function exit() {
  console.log("Bye!");
  process.exit(0);
}
//Main menu
async function menu() {
  const answer = await inquirer.prompt({
    type: "list",
    message: "What do you want to do?",
    name: "options",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add department",
      "Add role",
      "Add employee",
      "Update employee role",
      "Update employee manager",
      "Exit",
    ],
  });

  if (answer.options === "View all departments") {
    viewAllDepartments();
  } else if (answer.options === "View all roles") {
    viewAllRoles();
  } else if (answer.options === "View all employees") {
    viewAllEmployees();
  } else if (answer.options === "Add department") {
    addDepartment();
  } else if (answer.options === "Add role") {
    addRole();
  } else if (answer.options === "Add employee") {
    addEmployee();
  } else if (answer.options === "Update employee role") {
    updateEmployeeRole();
  } else if (answer.options === "Update employee manager") {
    updateEmployeeManager();
  } else if (answer.options === "Exit") {
    exit();
  }
}

menu(); // First executed function

// viewAllDepartments();
// viewAllRoles();
// viewAllEmployees();
// addDepartment().then(viewAllDepartments);
// addRole().then(viewAllRoles);
// addEmployee();

// complete the last 2 functions
// add one last function that lets the user select which function to run
