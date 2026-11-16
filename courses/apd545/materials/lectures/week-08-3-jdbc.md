Source: <APD545 Week 8 · Segment 3 "JDBC" 강의 슬라이드 (Seneca) 핵심 문장 발췌. 코드는 슬라이드 예제를 정리 (DB 파일 경로만 짧게 바꿈)>
# Week 8 · Segment 3. Introduction to JDBC

## Outcomes

> - Understanding of why Database Programming?
> - Understanding architecture of JDBC. Understanding of JDBC Interface.
> - Understanding the Technology of JDBC: Connectivity, Read operations, Write operations

## Why Java for Database Programming?

> - First, Java is platform independent. You can develop platform-independent database applications using SQL and Java for any relational database systems.
> - Second, the support for accessing database systems from Java is built into Java API, so you can create database applications using all Java code with a common interface.

## What is JDBC?

> Java Database Connectivity or JDBC API provides industry-standard and database-independent connectivity between the Java applications and relational database servers (relational databases, spreadsheets, and flat files).

## The Architecture of JDBC

> JDBC helps you to write Java applications that manage these three programming activities:
> - Connect to a data source, like a database
> - Send queries and update statements to the database
> - Retrieve and process the results received from the database in answer to your query

## JDBC API

> JDBC API consists of two packages: **`java.sql`** and **`javax.sql`**.
> A JDBC driver is a set of Java classes that implement the JDBC interfaces, targeting a specific database. The JDBC interfaces come with standard Java, but the implementation of these interfaces is specific to the database you need to connect to. Such an implementation is called a JDBC driver.

## Core JDBC Interfaces

> Loading drivers → Establishing connections → Creating and executing statements → Processing ResultSet
> - **DriverManager** is used to load a JDBC Driver.
> - **Connection** is being returned by the DriverManager's `getConnection` function.
> - A Connection is used to create a **Statement**, or to create and prepare a **PreparedStatement** or **CallableStatement**.
> - Statement and PreparedStatement objects are used to execute SQL statements. CallableStatement objects are used to execute stored procedures.
> - A Connection can also be used to get a **DatabaseMetaData** object.

## JDBC Driver Types

> 1. **Type 1: JDBC-ODBC bridge driver**: dependent on a native library, transitional solution, not supported by Oracle.
> 2. **Type 2: Java + Native code driver**: wraps a native API with Java classes (Oracle OCI driver). Expected to have better performance than a pure Java driver.
> 3. **Type 3: All Java + Middleware translation driver**: communicates using a network protocol to a middle-tier server.
> 4. **Type 4: All Java driver**: written entirely in Java, communicates directly with the database. No local native code is required. (Oracle's Thin driver)

## JDBC Technology: four steps

> - Connect to the database
> - Create a statement
> - Execute the query
> - Look at the result set
> - Close connection // not needed if you are using try-with-resources

## Basic JDBC Connection

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class StatementExample {
    public static void main(String[] args) {
        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:testDB.db")) {
            System.out.println(connection);
        } catch (SQLException e) {
            printSQLException(e);
        }
    }

    public static void printSQLException(SQLException ex) {
        for (Throwable e : ex) {
            if (e instanceof SQLException) {
                e.printStackTrace(System.err);
                System.err.println("SQLState: " + ((SQLException) e).getSQLState());
                System.err.println("Error Code: " + ((SQLException) e).getErrorCode());
                System.err.println("Message: " + e.getMessage());
                Throwable t = ex.getCause();
                while (t != null) {
                    System.out.println("Cause: " + t);
                    t = t.getCause();
                }
            }
        }
    }
}
```

## Create Statement Object and execute

```java
Statement statement = connection.createStatement();
statement.execute("Drop Table If Exists users");
String query = "Create Table IF NOT EXISTS Users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
             + "username varchar(20) not null, email varchar(20) not null, "
             + "country varchar(15), password varchar(20))";
boolean success = statement.execute(query);
if (success)
    System.err.println("Table is not created as the resultSet is being returned");
else
    System.err.println("Table is created");
```

## Execute statement with Insert

```java
int value = 0;
query = "Insert into users (username, email, country, password) "
      + "Values ('mali','m@ali.com','Canada','1234')";
value = statement.executeUpdate(query);
if (value != 0)
    System.err.println("1 row updated in the table");
```

## Execute statement with ResultSet

```java
query = "Select * from users";
ResultSet rs = statement.executeQuery(query);
while (rs.next()) {
    System.out.println(rs.getInt(1) + " " + rs.getString(2) + " " + rs.getString(3)
                       + " " + rs.getString(4) + " " + rs.getString(5));
}
```

## Prepared Statement

> - Prepared statements are precompiled statements that can be reused to execute identical SQL statements with different values more efficiently.
> - They make only one trip to the database for metadata, whereas statements make a round trip with each execution.
> - You use a question mark as a placeholder within the text of a SQL statement ... You can then replace that question mark with an appropriate value using one of the many available `setXXX()` accessor methods.

## execute, executeQuery, executeUpdate

> - The methods for executing SQL statements are `execute`, `executeQuery`, and `executeUpdate`, each of which accepts a string containing a SQL statement as an argument.
> - The `execute` method should be used if the execution produces multiple result sets, multiple update counts, or a combination of result sets and update counts.

## Benefits of using PreparedStatement

> - PreparedStatement allows you to write a dynamic and parametric query.
> - PreparedStatement is faster than Statement in Java. PreparedStatement gets pre-compiled in database and their access plan is also cached.
> - **PreparedStatement prevents SQL Injection attacks in Java**: all the parameters passed as part of the place-holder will be escaped automatically by JDBC Driver.
> - PreparedStatement queries are more readable and secure than cluttered string concatenated queries.

## Insert and Select using PreparedStatement

```java
query = "Insert into books (bname, bcategory, bprice, bisbn) Values (?,?,?,?)";
ps = connection.prepareStatement(query);
ps.setString(1, "Harry Potter");
ps.setString(2, "Fantacy");
ps.setDouble(3, 65.3);
ps.setString(4, "123456789");
value = ps.executeUpdate();
if (value != 0)
    System.err.println("1 row updated in the table");

query = "Select * from books where bname = ?";
ps = connection.prepareStatement(query);
ps.setString(1, "Harry Potter");
ResultSet rs = ps.executeQuery();
while (rs.next()) {
    System.out.println(rs.getInt(1) + " " + rs.getString(2) + " " + rs.getString(3)
                       + " " + rs.getString(4) + " " + rs.getString(5));
}
```
