Source: <APD545 Week 3 · Segment 4 "Service Layer" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 3 · Segment 4. Service Layer

## Service Layer

> A Service Layer is a dedicated part of your application that contains **business logic**: the rules, operations, and workflows of your system. Purpose: keep controllers clean, centralize logic in one place, make code easier to maintain and test, promote modular design.

## Why do we use Service Layer?

> - Avoids **"fat controllers"**
> - Encourages separation of concerns
> - Makes the system easier to extend
> - Allows reuse of logic across multiple controllers
>
> Key Concept: **Controllers coordinate, services think.**

## Service Layer in the Example

> controllers/ handles user actions, services/ contains business logic, models/ holds data structures. LibraryController calls BookService, UserService, IssuanceService.

## Working in the Example

> Controller receives input, delegates to a service (`bookService.addBook(book)`). Service validates, updates internal data, applies rules, and returns results. **Controller does NOT contain logic.**

## Issuance Services

> Handles rules like "A book cannot be issued twice" and "A user must exist before issuing". These are **business rules, not controller rules**.

## Service Layer vs. Service Layer Design Pattern

> What we implemented: a Service Layer. What we did NOT implement yet: the full Service Layer Design Pattern, which includes **interfaces, dependency injection, stateless services, repository layer**. Coming soon.
