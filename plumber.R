# plumber.R

# Load necessary libraries
library(plumber)
library(DBI)
library(odbc)
library(dplyr)

# Establish database connection
connection_string <- paste0(
  "Driver=ODBC Driver 17 for SQL Server;",
  "Server=LAPTOP-QMGI0I7U\\SQLEXPRESS;",
  "Database=test3;",
  "trusted_connection=yes;"
)

# Connect using the specified connection string
con <- dbConnect(odbc(), .connection_string = connection_string)

#' @filter cors
cors <- function(req, res) {
  
  res$setHeader("Access-Control-Allow-Origin", "*")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$setHeader("Access-Control-Allow-Methods","*")
    res$setHeader("Access-Control-Allow-Headers", req$HTTP_ACCESS_CONTROL_REQUEST_HEADERS)
    res$status <- 200 
    return(list())
  } else {
    plumber::forward()
  }
  
}

#* Get all students
#* @get /students
function() {
  query <- "SELECT * FROM Students"
  students <- dbGetQuery(con, query)
  return(students)
}

#* Get students for a specific page
#* @get /students/:page/:limit
function(page, limit) {
  page <- as.numeric(page)
  limit <- as.numeric(limit)
  # Query to get students for the specific page
  query <- sprintf("WITH NumberedRows AS (
                    SELECT *, ROW_NUMBER() OVER (ORDER BY StudentID) AS row_num
                    FROM Students
                    )
                    SELECT *
                    FROM NumberedRows
                    WHERE row_num BETWEEN '%s' AND '%s'",(page - 1) * limit + 1, page * limit)
  students <- dbGetQuery(con, query)
  return(students)
}

#* Add a new student
#* @post /students
function(student_id, first_name, last_name, email, date_of_birth, hometown, total_score) {
  query <- sprintf("INSERT INTO Students (StudentID, FirstName, LastName, Email, DateOfBirth, Hometown, TotalScore) VALUES (%s, '%s', '%s', '%s', '%s', '%s', %s)",
                   student_id, first_name, last_name, email, date_of_birth, hometown, total_score)
  dbExecute(con, query)
}

#* Update a student
#* @put /students/:student_id
function(student_id, first_name, last_name, email, date_of_birth, hometown, total_score) {
  query <- sprintf("UPDATE Students SET FirstName='%s', LastName='%s', Email='%s', DateOfBirth='%s', Hometown='%s', TotalScore=%s WHERE StudentID=%s",
                   first_name, last_name, email, date_of_birth, hometown, total_score, student_id)
  dbExecute(con, query)
}

#* Delete a student
#* @delete /students/:student_id
function(student_id) {
  query <- sprintf("DELETE FROM Students WHERE StudentID=%s", student_id)
  dbExecute(con, query)
}

#pr('plumber.R') %>% pr_run(port = 8000)
