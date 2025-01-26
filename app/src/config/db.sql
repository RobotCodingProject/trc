use trc_jj;


CREATE TABLE users (
	id varchar(30) NOT NULL,
    name varchar(30) NOT NULL,
    pw varchar(30) NOT NULL,
    in_date datetime DEFAULT current_timestamp,
    
    PRIMARY KEY (id)
);


INSERT INTO users(id, name, pw)
	values("admin", "trc", "trcjj"),
    ("jenny", "jenny", "1234"),
    ("jisu", "jisu", "5678");


CREATE TABLE contacts (
	student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name varchar(255) NOT NULL,
    school_name varchar(255),
    school_year int,
    parent_name varchar(255),
    contact_number varchar(255) NOT NULL,
    email varchar(255),
    trial_date_time DATETIME,
    ndis ENUM('Yes', 'No') NOT NULL DEFAULT 'No',
    class_day ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    class_time TIME
);


INSERT INTO contacts(student_id, student_name, school_name, school_year, parent_name, contact_number, email, trial_date_time, ndis, class_day, class_time)
	values(student_id, "admin", "trc", null, "trc admin", "0412345678", "admin@trc.edu", null, default, null, null);