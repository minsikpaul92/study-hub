Source: <APD545 Week 1 · Segment 1 "Java for C++ Programmers" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 1 · Segment 1. Introduction to Java

## Outcomes

> - Understanding of Java as Language.
> - Understanding the Java Virtual Machine.
> - Understanding the Java Garbage Collector.

## What is Java?

> Java can be broadly defined as
> - **A General Purpose**: Its not constraint to one particular domain
> - **Object Oriented**: Helps model real world scenarios in more natural way
> - **Platform Independent**: Write Once Run Anywhere (WORA)
> - **Concurrent**: Multithreaded

## Why is Java such a Popular Language?

> High quality learning resources · Inbuilt functions and libraries · Active community support · High-quality development tools · Platform Independent · Security
>
> "Java code can run on any underlying platform like Windows, Linux, iOS, or Android without rewriting."

## How does Java Work? The Platform

> To use Java, a developer needs to understand two things:
> - **Java language and APIs**: This is the front-end communication between the developer and the Java platform.
> - **Java Virtual Machine**: This is the back-end communication between the Java platform and the underlying hardware.

### Java API

> APIs are important software components bundled with the Java Platform. These are pre-written Java programs that can plug and play existing functionality into your own code.

### JVM (Java Virtual Machine)

> The Java Virtual Machine acts as an additional abstraction layer between the Java platform and the underlying machine hardware.
> Java source code can run only on those machines that have JVM installed on them.

## Compilers vs Interpreters

> **Compilers**: the language then compiles (or translates) the entire code into machine code. The compiled code is then run on the hardware.
>
> **Interpreters**: every high-level code statement is interpreted into machine code on the fly.

## Java Runtime Environment

> - The Java program was the first language to combine both methods (compiler & Interpreted) using a Java Virtual Machine (JVM).
> - Any Java file is first compiled into bytecode.
> - Java bytecode can only run in the JVM.
> - The JVM then interprets the bytecode to run it on the underlying hardware platform.

## Java Editions

> - **Java Standard Edition (JSE)**: To develop client-side applications. (For Desktop Application Development)
> - **Java Enterprise Edition (JEE)**: To develop server-side applications
> - **Java Micro Edition (JME)**: To develop mobile based applications.
>
> Note: We are going to use JSE for the course.

## Steps to Use Java SE

> - **Coding**: produced by the programmer.
> - **Compiling**: build the program into bytecode. Result is a ".class" file. Compiler command: `javac`
> - **Running**: class file (bytecode) is loaded by the JVM. JVM command: `java`
> - **Bytecode Verification**, **Internal Integrity Check**
> - **Execution**: Program execution begins from the main entry point.
