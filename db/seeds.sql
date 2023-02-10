INSERT INTO departments (name)
VALUES ("Human Resources"),
       ("Finance & Logistics"),
       ("Consulting"),
       ("Sales"),
       ("Research & Development"),
       ("Engineer");

INSERT INTO roles (title, department_id, salary)
VALUES ("Hiring Manager", 1, 60000),
       ("Accountant", 2, 75000),
       ("Patent Lawyer", 2, 175000),
       ("Resource Manager", 2, 120000),
       ("Design Contractor", 3, 115000),
       ("Ad Designer", 4, 75000),
       ("Campaign Manager", 4, 80000),
       ("Biochemist", 5, 70000),
       ("Lab Technician", 5, 65000),
       ("Quality Control Engineer", 6, 80000),
       ("Process Engineer", 6, 80000),
       ("Production Engineer", 6, 85000);

INSERT INTO employees (first_name, last_name, title_id, manager_id)
VALUES ("Karry", "Wayn", 6, 4),
       ("Cassie", "Roberts", 3, NULL),
       ("Amanda", "Williams", 11, 12),
       ("Billie", "Azure", 7, NULL),
       ("Avery", "Gates", 5, 4),
       ("Chris", "Nevins", 2, 4),
       ("Tyler", "Holmes", 4, NULL),
       ("Erin", "Walker", 9, 8),
       ("Lawrence", "Kane", 8, 11),
       ("Greg", "Thomas", 2, 3),
       ("Patty", "Whytes", 1, 4),
       ("Kristy", "Phine", 12, NULL),
       ("May", "Tang", 10, 12),
       ("Richy", "Cher", 9, 10);
       
