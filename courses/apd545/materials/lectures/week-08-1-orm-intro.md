Source: <APD545 Week 8 · Segment 1 "ORM's" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 8 · Segment 1. Introduction to ORM

## Outcomes

> - What are ORM's? · Benefits of ORM's. · Disadvantages of ORM's. · ORM Patterns · Best practices for building persistence layers

## Why the need?

> - One of the Biggest challenge comes from Database.
> - Enterprise level of application usually involve persistent data.
> - The data is persistent because it needs to be around between multiple runs of the program.
> - Usually, many people access data concurrently.

## Different types of systems

> - A B2C (business to customer) online retailer: we need to be able to handle a very high volume of users.
> - A system that automates the processing of leasing agreements: many fewer users, more complicated business logic.
> - A simple expense-tracking system for a small company: you have to build it very quickly and bear in mind that it may grow.

## What are patterns?

> Each pattern describes a problem which occurs over and over again in our environment, and then describes the core of the solution to that problem, in such a way that you can use this solution a million times over, without ever doing it the same way twice.

## The Three Principal Layers (3-Tier Architecture)

> - **Presentation**: Presentation logic is about how to handle the interaction between the user and the software.
> - **Data Source**: Data source logic is about communicating with other systems that carry out tasks on behalf of the application.
> - **Domain Logic**: also referred to as business logic. It involves calculations based on inputs and stored data, validation of any data that comes in from the presentation and figuring out exactly what data source logic to dispatch.

## Trouble with Objects

> - From an OO standpoint, the problem with these persistence mechanisms is that their core abstractions are not objects.
> - They are tables with rows and columns (RDBMS) or (some variation on) key-value pairs (NoSQL).
> - The OO world has classes, sub-classes, inheritance, associations, objects, attributes, methods, polymorphism. These concepts do not easily map into the abstractions of persistence mechanisms.

## Example: Dog and Owner

> - You will at least have a table called `dogs` to store Dog instances and a table called `owners` to store Owner instances.
> - Convention of many object-relational mapping systems: class names are singular; table names are the associated plural form: Person ⇒ People; Cat ⇒ Cats.
> - For each table you would have columns that correspond to each attribute (plus an implicit id column); each row would correspond to an instance of the class: `1 | Fido | true`

### Relationship between Dog and Owner

> - Owner participates in a "has_one" relationship with Dog. Dog participates in a "has_many" relationship with Owner.
> - The short answer is **foreign key relationships and join tables**.
> - You might see code like: `List<Owner> owners = dog.getOwners();` Behind the scenes, the method will hide the database calls required.

### Join table

> - dogs: `1 | Fido | true`, `2 | Spot | false`; owners: `1 | Ken`, `2 | Max`
> - A third table is then used to maintain mappings between them: `1 | 1 ; 1 | 2 ; 2 | 2`
> - This says that Fido is owned by Ken and Max and Spot is owned by Max.
> - That third table is known as a join table and has the structure `dog_fk | owner_fk`.

## What is ORM then?

> - Object-relational mapping is a programming technique for converting data between incompatible type systems by creating objects using OO programming languages, essentially wrapping tables or stored procedures in classes.
> - ORM is an automated way of connecting an object model, sometimes referred to as a domain model, to a relational database by using metadata as the descriptor of the object and data. This creates, in effect, a "virtual object database".
> - This act of mapping is an efficient way to overcome the mismatch that exists between object-oriented development languages and relational databases.

## Relational Models vs OO Models

> - Types (ex. `char(n)` versus string)
> - Identity (keys versus address or equality)
> - Relations (foreign keys versus references)
> - Many to many relations require linking table in SQL
> - Inheritance and polymorphism

## Benefits of ORM

> - Automates the Object-to-table and Table-to-object conversions.
> - Work in the OO model without having to worry about the underlying data structure.
> - Typically provide support for the full set of CRUD (create, read, update, delete) operations.
> - Save time and money (time to market). Focus on the business logic rather than database/persistence logic.

## Selecting a suitable ORM

> - **Object-to-database mapping**: The single most important aspect of an ORM tool.
> - **Object caching**: to improve performance.
> - **GUI mapping**: Can survive without it but it will be bonus.
> - **Dynamic Querying**
> - **Lazy loading**: Improves the performance by optimizing the memory utilization of database server.
> - **Nonintrusive persistence**: no more class, interface or inheritance based specific relations.
