Source: <APD545 Week 13 · Segment 2 "Thread pooling and JDBC Pooling" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌. 코드는 개념을 보여 주려고 해설용으로 새로 쓴 예시>
# Week 13 · Segment 2. Thread Pooling and JDBC Pooling

## Thread Pools: why?

> Two ways to improve execution efficiency: use threads, or use **thread pools**. In production environments, we usually use the latter.

## Pooling Technology

> Pooling technology refers to **preparing some resources in advance**, and these pre-prepared resources can be **reused** when needed. Two main advantages: preparation in advance, and reuse. Creating an object (look up the class, load it, allocate heap memory, run initialization) is complex and time-consuming.

## Application of Pooling Technology

> Thread pool, memory pool, **database connection pool**, HttpClient connection pool, etc.

## Thread Pool

> A certain number of threads are started in the pool first, all in the **sleep** state. When a new request comes, a sleeping thread **wakes up** and processes it; afterwards it sleeps again. If a new thread is created for each client request, the CPU time and memory consumption are staggering.

```java
// 예시 코드: 스레드 2개로 작업 5개 처리
ExecutorService pool = Executors.newFixedThreadPool(2);
for (int i = 1; i <= 5; i++) {
    int id = i;
    pool.execute(() ->
        System.out.println("task " + id + " on " + Thread.currentThread().getName()));
}
pool.shutdown();
// only pool-1-thread-1 and pool-1-thread-2 appear: threads are reused
```

## Memory Pool

> Enough memory is allocated in advance. Each request gets a free piece, marked as used; releasing it puts it **back into the pool**, marked idle. Advantages: less **memory fragmentation**, higher reuse. Disadvantage: **wastes memory**, since a large idle block is allocated at the beginning and may not be used.

## Database Connection Pool

> Store database connections as objects in memory when the system is initialized. When the user needs the database, an **idle connection is taken from the pool** instead of establishing a new one. After use, the connection is **put back into the pool** (not really closed). Parameters: initial number of connections, upper and lower limits, maximum uses per connection, maximum idle time.

```java
// 예시 코드: 풀에서 빌리고 돌려주는 흐름 (DataSource는 풀 라이브러리가 제공)
try (Connection conn = dataSource.getConnection();          // borrow an idle connection
     PreparedStatement ps = conn.prepareStatement("SELECT name FROM student WHERE id = ?")) {
    ps.setInt(1, 7);
    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) System.out.println(rs.getString("name"));
    }
}   // conn.close() returns it to the pool
```

## Thread Pool separates threads and tasks

> A thread pool **separates the concepts of threads and tasks**, avoiding the performance overhead of frequent creation and destruction. Once a thread is created, it remains in the pool and waits for the next task.

## Advantages of Thread Pools

> 1. **Reuse threads** to reduce resource consumption (each thread needs its own VM stack, native method stack and program counter). 2. **Improve responsiveness**: existing threads execute tasks faster. 3. **Manage the number of threads and tasks**: a fixed number of threads avoids creating threads infinitely.

## Disadvantages of Thread Pools

> Too many threads slow the system down: the number of CPU cores is fixed, and too many threads cause contention and frequent **thread switching**. The appropriate number of threads is key. When tasks exceed a limit, a **rejection strategy** handles the excess tasks.
