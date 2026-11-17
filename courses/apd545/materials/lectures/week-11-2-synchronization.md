Source: <APD545 Week 11 · Segment 2 "Thread Synchronization" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 11 · Segment 2. Thread Synchronization

## Thread Synchronization

> A shared resource may be **corrupted** if it is accessed simultaneously by multiple threads. For example, two unsynchronized threads accessing the same bank account may cause conflict.

## Race Condition

> John and Anita both want to withdraw $75 from a balance of $100. Both check `balance >= amount` before either subtracts, so both withdraw and the account is **overdrawn**.

```java
void makeWithdrawal(int amount) {
    if (balance >= amount) {     // both threads pass this check
        balance -= amount;       // 100 - 75 - 75 = -50
    }
}
```

## Synchronization Concept

> Synchronization is built around the **intrinsic lock**. Every object has an intrinsic lock. A thread that needs access to an object's fields has to acquire the lock and release it when done. Any other thread will **block** when it attempts to acquire a lock owned by another thread.

## Types of Synchronization

> Thread synchronization: 1. **Mutual Exclusive** (synchronized method, synchronized block, static synchronization), 2. **Cooperation** (inter-thread communication).

## Synchronized Method

> When a thread invokes a synchronized method, it automatically acquires the intrinsic lock for **that method's object**, and releases it when the method returns.

```java
class Table {
    synchronized void printTable(int n) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(n * i);
            try { Thread.sleep(400); } catch (Exception e) { System.out.println(e); }
        }
    }
}

Table obj = new Table();
new Thread(() -> obj.printTable(5)).start();
new Thread(() -> obj.printTable(100)).start();
// without synchronized: 5 100 10 200 ... (inconsistent)
// with synchronized:    5 10 15 20 25 100 200 300 400 500
```

## Synchronized Block

> Synchronized statements must **specify the object** that provides the intrinsic lock. The scope of a synchronized block is **smaller** than the method.

```java
public void addName(String studentName) {
    synchronized (this) {
        lastName = studentName;
        nameCount++;
    }
    studentList.add(studentName);
}
```

## Static Synchronization

> If you make a static method synchronized, the lock is on the **class**, not on the object. Threads using two different objects (object1, object2) can interfere with a normal synchronized method; static synchronization solves this.

## Deadlock

> Threads t1 and t2 are **blocked forever, waiting for each other**.

```java
Thread t1 = new Thread(() -> {
    synchronized (resource1) {
        System.out.println("Thread 1: locked resource 1");
        try { Thread.sleep(100); } catch (Exception e) { }
        synchronized (resource2) { System.out.println("Thread 1: locked resource 2"); }
    }
});
Thread t2 = new Thread(() -> {
    synchronized (resource2) {
        System.out.println("Thread 2: locked resource 2");
        try { Thread.sleep(100); } catch (Exception e) { }
        synchronized (resource1) { System.out.println("Thread 2: locked resource 1"); }
    }
});
// Output stops after: Thread 1: locked resource 1 / Thread 2: locked resource 2
```
