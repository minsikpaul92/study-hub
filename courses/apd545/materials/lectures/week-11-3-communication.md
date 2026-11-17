Source: <APD545 Week 11 · Segment 3 "Thread Communication" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 11 · Segment 3. Thread Communication

## Java Monitors

> A **monitor** is an object with mutual exclusion and synchronization capabilities. Only one thread can execute a method at a time in the monitor. Any object can be a monitor; it becomes one once a thread locks it. A thread can **wait** in a monitor if the condition is not right for it to continue.

## Guarded Blocks

> The guarded block is the most common coordination idiom. It uses three methods from the **Object** class:
> - `wait()`: causes the current thread to wait until another thread invokes `notify()` or `notifyAll()` for this object.
> - `notify()`: wakes up a **single** thread waiting on this object's monitor.
> - `notifyAll()`: wakes up **all** threads waiting on this object's monitor.

## Inter-thread communication process

> 1. Threads enter to acquire the lock. 2. The lock is acquired by one thread. 3. The thread goes to waiting state if `wait()` is called (otherwise it releases the lock and exits). 4. After `notify()`/`notifyAll()`, it moves to the notified (runnable) state. 5. It can acquire the lock again. 6. After its task, it releases the lock and exits the monitor.

## Example: Using Monitor

> `wait()`, `notify()`, `notifyAll()` must be called in a **synchronized** method or block on the receiving object, otherwise an **IllegalMonitorStateException** occurs. When `wait()` is invoked, it pauses the thread and **releases the lock**. After being notified, the lock is automatically reacquired.

```java
class ThreadCommunication {
    int amount = 10000;

    synchronized void withdraw(int amount) {
        System.out.println("going to withdraw...");
        while (this.amount < amount) {
            System.out.println("Less balance; waiting for deposit...");
            try { wait(); } catch (InterruptedException e) { }
        }
        this.amount -= amount;
        System.out.println("withdraw completed...");
    }

    synchronized void deposit(int amount) {
        System.out.println("going to deposit...");
        this.amount += amount;
        System.out.println("deposit completed...");
        notify();
    }
}

ThreadCommunication c = new ThreadCommunication();
new Thread(() -> c.withdraw(15000)).start();
new Thread(() -> c.deposit(10000)).start();
```

## wait() Method Idiom

> **Always invoke wait inside a loop** that tests for the condition being waited for.

```java
public synchronized void guardedExamResult() {
    while (!examResult) {
        try { wait(); } catch (InterruptedException e) { }
    }
    System.out.println("Exam Result have been received!");
}
```

## notifyAll() Method Idiom

> When notifyAll is invoked, it informs **all** threads waiting on a lock that something important has happened. `notify` wakes up a single thread and doesn't let you choose which one.

```java
public synchronized void notifyExamResult() {
    examResult = true;
    notifyAll();
}
```
