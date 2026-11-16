Source: <APD545 Week 8 · Segment 2 "ORM's and Design Patterns" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 8 · Segment 2. ORM and Design Patterns

## Domain-Driven Design (DDD)

> - DDD is one of the focused software development philosophies that overcome the complexities of the problem.
> - **Domain**: is the knowledge, influence or activity around which we work to solve the problem on hand.
> - **Domain Model**: an object model of the domain that incorporates both behavior and data.

## UML

> - The most common language used for modeling. There is total 13 diagrams in UML.
> - **Class Diagram**: Displays static model with all the attributes and relationships between classes and interfaces. Can also include Inheritance, Composition, Associations, Aggregations.
> - **Object Diagram**: Is a simplified version of a class diagram. Depicts the role of an object plays when instantiated and its multiplicity.
> - **Sequence Diagram**: Represent stereotyped elements, such as screens, controllers, entities, and database items.

## Domain Model Structure

> A domain model can be broken into these pieces: **Entities, Value Objects, Services, Aggregates, Factories, Repositories**

### Entities

> - Tech definition: In Database entity is a table.
> - Identity: which defines uniqueness not only in real world but also in software world.
> - Example: Car has a VIN. Your car object which has its identity becomes an entity.

### Value Objects

> - They can't exist by themselves. Example: model, engine, color etc. can't exist on their own.
> - A value object is typically an immutable object with no identity, containing values used to describe entities.

### Aggregate

> A logical grouping of entities and value objects into a collection, so that complex relationships that can lead to data inconsistencies in your application and database can be reduced.

## Object-Relational Patterns

> - **Domain Model**: creates a web of interconnected objects, where each object represents some meaningful individual, whether as large as a corporation or as small as a single line on an order form.
> - **Table Module**: create a class per table.
> - **Active Record**: similar to the table module except that the table module is an architectural design principle, whereas an active record falls under the data access pattern category. The active record pattern also encapsulates database access functionality.
> - **Database Mapper**: map objects to a relational database, accomplished by using metadata (for the most part XML) to describe the attributes and relationships between the object model and the data model.

## Inheritance Mapping

> There are three key inheritance-mapping approaches:
> - **A single table per class hierarchy**: Mapping your entire class structure to a single table. Quick and easy approach.
> - **A table per concrete class**: The most common approach. Maps each non-abstract class to its own table.
> - **A table per class**: each class to its own table.

## Relationships

> One-to-One · One-to-Many · Many-to-Many

## Lazy Loading

> A way to optimize memory utilization of database servers by prioritizing components that need to be loaded into memory when a program is started.
> Example: take out only the ingredients you need as you need them (small kitchen, many dishes).
