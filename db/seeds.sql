INSERT INTO departments (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO roles (title, department_id, salary)
VALUES ("Sales Lead", 1, 100000),
       ("Sales Person", 1, 80000),
       ("Lead Engineer", 2, 150000),
       ("Software Engineer", 2, 120000),
       ("Account Manager", 3, 160000),
       ("Accountant", 3, 125000),
       ("Legal Team Lead", 4, 250000),
       ("Lawyer", 4, 190000);

INSERT INTO employees (first_name, last_name, title_id, manager_id)
VALUES ("Karry", "Wang", 4, NULL),
       ("Cassie", "Roberts", 3, 1),
       ("Amanda", "Williams", 1, NULL),
       ("Billie", "Azure", 7, NULL),
       ("Avery", "Gates", 8, 5),
       ("Chris", "Nevins", 6, 7),
       ("Tyler", "Holmes", 5, NULL);
       
