Source: <APD545 Week 11 · Segment 1 "Threads" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 11 · Segment 1. Threads

## Motivation

> Single-threaded applications can lead to **poor responsiveness** where lengthy activities must complete before others can begin. Poor utilization of CPU resources.

## What is a Thread?

> A thread is the **flow of execution**, from beginning to end, of a task. Threads organize programs into logically separate paths. Threads can **share access to common resources**.

## Multi-thread

> The process of executing multiple threads simultaneously is known as **multithreading**. Example: while you are writing a word document, your spell checker is also working.

## Concept

> In a single-processor system the multiple threads share the CPU time, also known as **time-sharing**. The OS is responsible for scheduling and allocating resources to them. In a multi-processor system the threads can work on different processors.

## Thread in Java

> Each thread has its own **method-call stack** and a **program counter**. All threads in the application share the same resources like **memory** and file handles.

## Life cycle of a thread

> - **New**: an instance of Thread is created, before `start()` is invoked.
> - **Runnable**: after `start()`, but the scheduler has not selected it yet.
> - **Running**: the thread scheduler has selected it.
> - **Non-Runnable (Blocked)**: still alive, but currently not eligible to run.
> - **Terminated**: its `run()` method exits.

## Defining a Thread

```java
// 1. Extend Thread
public class MyThread extends Thread {
    public void run() { /* task */ }
}

// 2. Implement Runnable
public class MyRunnable implements Runnable {
    public void run() { /* task */ }
}
```

## Runnable Interface

> Runnable has only one method named `run()`. Your class must override `run` and implement it.

## Creating and Starting a Thread

```java
Runnable r = new MyRunnable();
Thread t = new Thread(r);
t.start();
```

## Thread Scheduler in Java

> The thread scheduler is the part of the JVM that decides which thread should run. There is **no guarantee** which runnable thread will be chosen. **Preemptive**: the highest priority task executes until it enters the waiting or dead states. **Time slicing**: a task executes for a predefined slice of time and then reenters the pool of ready tasks.

## Can we start the same thread twice?

> No. If you do so, an **IllegalThreadStateException** is thrown.

```java
Thread t1 = new Thread(new TestThreadTwice1());
t1.start();
t1.start();   // running... then IllegalThreadStateException
```

## Calling run() directly

> You can call `run()` directly, but then it acts as a **normal method** and no multithreading takes place.

```java
myThreadone.run();   // 1 2 3 4
myThreadtwo.run();   // then 1 2 3 4 (one after the other)

myThreadone.start(); // 1 1 2 2 3 3 4 4 (interleaved)
myThreadtwo.start();
```

## sleep

> `public static void sleep(long millis) throws InterruptedException`. Causes the current thread to suspend execution for a specified period; the scheduler picks up another thread. InterruptedException is a **checked** exception.

## join

> You can use the `join()` method to force one thread to **wait for another thread to finish**.

```java
t1.start();
try { t1.join(); } catch (InterruptedException e) { }
t2.start();   // t2 and t3 start only after t1 has printed 1..5
t3.start();
```

## Thread methods

> `getName()`, `setName(String)`, `getId()`, `currentThread()`, `isAlive()` (true if Ready, Blocked or Running; false if new or finished), `interrupt()`, `isInterrupted()`. Each thread has a default priority of `Thread.NORM_PRIORITY`; change it with `setPriority(int)` (`MIN_PRIORITY`, `MAX_PRIORITY`).

## Thread Pools

> Creating each task and starting each one separately can cause limited throughput and poor performance. A **thread pool** is an ideal way to manage the number of tasks executing concurrently.

## Java Executor

> `Executor` executes tasks in the pool; `ExecutorService` (a sub-interface) maintains and controls them.

```java
ExecutorService executor = Executors.newFixedThreadPool(1);   // number of threads
executor.execute(new PrintChar('a', 50));
executor.execute(new PrintNumber(50));
executor.execute(new PrintString("Hello", 50));
// one thread: the three tasks run sequentially

ExecutorService executor2 = Executors.newCachedThreadPool();
// new threads are created for waiting tasks: all run concurrently
```
