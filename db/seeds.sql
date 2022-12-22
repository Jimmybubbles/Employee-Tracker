-- insert names of departments into the department table
INSERT INTO department 
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

-- insert names of roles salary and department id
INSERT INTO roles
    (title, salary, department_id)
VALUES
    ('Sales person', 100000, 1),
    ('Software Engineer', 120000, 2),
    ('Accountant', 120000, 3),
    ('Lawyer', 150000, 4);

-- insert in employee table first name last name role id and manager id
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Tom', 'Cruise', 1, 4),
    ('Billy', 'Crystal', 2, 3),
    ('Sam', 'Brown', 3, 1),
    ('Sarah', 'Mendosa', 4, 2);