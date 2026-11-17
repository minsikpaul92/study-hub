Source: <APD545 Week 5 · Segment 1 "Separating Models, Views and Controller" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 5 · Segment 1. Separating Model, View and Controller

## Re-visiting MVC

> The model classes deal with the business logic aspects of the application and the user interface is the "front end". We can further split the user interface classes into two portions called the view and the controller:
>
> - The **view** displays the necessary information from the model into a form suitable for interaction.
> - The **controller** accepts input from the user and modifies the model accordingly.

## Motivation

> The user sees the view of the application and then interacts with the controller. Such interaction usually results in the model being modified in some way. Then these model changes are reflected back to the view.

## The need

> So far all our GUI code was lumped together into one Application class. Now we will discuss the "proper" way of splitting up the model, the view and the controller into a nice & clean modular style that allows us to modify and replace any of the three components cleanly.
>
> There are 3 main advantages of using the MVC architecture:
> - it **decouples** the models and views,
> - it **reduces the complexity** of the overall architectural design and
> - it **increases flexibility and maintainability** of code.
