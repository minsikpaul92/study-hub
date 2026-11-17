# Week 11. 스레드: 생성, 동기화, wait/notify

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. ⌨️ 표시가 있는 코드는 IntelliJ에서 `main`으로 직접 돌려 보세요. 스레드 출력은 **실행할 때마다 순서가 달라질 수 있어요**. 그게 정상이에요.
>
> 시간이 오래 걸리는 일(파일 저장, DB 조회)을 하는 동안 화면이 멈추지 않게 하려면 스레드가 필요해요. Week 8 JDBC, Week 9 IO, Week 13 소켓 서버(클라이언트마다 스레드 하나)와 이어져요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 시험에 나오는 모양 |
| --- | --- | --- |
| Thread | 작업 하나의 실행 흐름. 자기 **호출 스택**, 메모리는 **공유** | 정의 |
| 만드는 법 2가지 | `extends Thread` / `implements Runnable` + `new Thread(r)` | 둘 다 `run()` 오버라이드 |
| start vs run | `start()`는 새 스레드, `run()` 직접 호출은 그냥 메서드 | 출력 순서 |
| 생명주기 | New → Runnable → Running → Blocked → Terminated | isAlive() |
| 두 번 start | `IllegalThreadStateException` | |
| sleep / join | 잠깐 멈춤 / 저 스레드 끝날 때까지 기다림 | InterruptedException(checked) |
| 스케줄러 | 어떤 스레드가 돌지 **보장 없음**. Preemptive, Time slicing | |
| Thread Pool | `Executors.newFixedThreadPool(n)`, `newCachedThreadPool()` | 스레드 1개면 순서대로 |
| Race condition | 공유 데이터를 동시에 바꿔 값이 깨짐 | 은행 출금 예 |
| synchronized 메서드 | **this 객체**의 락 | |
| synchronized 블록 | `synchronized(객체) { }`, 범위가 더 작음 | 락 객체 지정 |
| static synchronized | **클래스** 락. 다른 객체끼리도 막음 | |
| Deadlock | 서로 상대 락을 기다리며 영원히 멈춤 | 락 순서 |
| wait / notify / notifyAll | **Object**의 메서드. synchronized 안에서만 | IllegalMonitorStateException |

**함정 모음**

- `t.run()`을 부르면 새 스레드가 **안 생겨요**. main 스레드가 그냥 메서드를 실행해요.
- 끝난 스레드도 다시 `start()` 못 해요. 새 `Thread` 객체를 만들어야 해요.
- `sleep`, `join`, `wait`은 `InterruptedException`(checked)을 던져서 try-catch 필수.
- `synchronized` 메서드는 **같은 객체**를 쓰는 스레드끼리만 막아요. 객체가 다르면 락도 달라요.
- `wait()`은 락을 **놓고** 기다려요. `sleep()`은 락을 **쥔 채로** 자요. 시험 단골 비교.
- `wait()`은 `if`가 아니라 **`while`** 안에서. 깨어났을 때 조건을 다시 확인해야 해요.
- `wait/notify`는 Thread의 메서드가 아니라 **Object**의 메서드예요.

{{PRACTICE}}

{{TOC}}

@@SLIDE week-11-1-threads.md
@@S _doc | read
스레드가 무엇인지, Java에서 스레드를 만들고 시작하는 두 가지 방법, 생명주기, sleep과 join, 스레드 풀을 배워요.
@@S Calling run() directly | type
할 일: 1~4를 0.5초 간격으로 출력하는 Runnable을 만들고 run() 두 번 호출과 start() 두 번 호출의 출력 순서를 비교
@@S join | type
할 일: t1.start() 후 t1.join()을 하고 t2, t3를 시작해서 t1의 1~5가 먼저 다 나오는지 확인
@@S Java Executor | type
할 일: newFixedThreadPool(1)과 newCachedThreadPool()에 같은 작업 3개를 넣고 출력이 순서대로인지 섞이는지 비교
@@K Motivation
스레드가 하나뿐이면 오래 걸리는 일이 끝날 때까지 **다른 일을 아무것도 못 해요**. JavaFX에서 버튼을 눌러 10초짜리 작업을 하면 그동안 창이 "응답 없음"이 돼요. 그리고 CPU 코어가 여러 개여도 하나만 써서 낭비예요.
@@K What is a Thread?
스레드 = 작업 하나가 처음부터 끝까지 **실행되는 흐름**. 한 프로그램 안에 흐름을 여러 개 둘 수 있어요. 스레드끼리는 같은 객체(메모리)를 **공유**할 수 있어서 편하지만, 그래서 동기화 문제(Segment 2)가 생겨요.
@@K Multi-thread
멀티스레딩 = 여러 스레드를 동시에 실행. 워드에서 타이핑하는 동안 맞춤법 검사가 뒤에서 도는 것처럼요. 다른 예: 음악 앱이 노래를 틀면서 다음 곡을 다운로드.
@@K Concept
- **CPU 하나**: 진짜 동시가 아니라 아주 짧게 번갈아 실행(**time-sharing**). 너무 빨라서 동시처럼 보여요.
- **CPU 여러 개**: 스레드가 서로 다른 코어에서 진짜로 동시에 돌 수 있어요.

누가 언제 실행할지는 **OS(와 JVM)**가 정해요. 우리가 정할 수 없어요.

⚠️ 슬라이드 원본에는 "실제로는 여러 코어를 동시에 쓰지 않는다"는 문장이 있는데, 요즘 JVM은 멀티코어에서 스레드를 실제로 동시에 실행해요. 시험에서는 "단일 CPU는 time-sharing, 멀티 CPU는 병렬 실행 가능"으로 기억하세요.
@@K Thread in Java
스레드마다 **자기 것**: 메서드 호출 스택(지역 변수), 프로그램 카운터(지금 몇 번째 줄인지).
스레드끼리 **공유**: 힙 메모리(객체, 필드), 열린 파일.

그래서 **지역 변수는 안전**하고, **여러 스레드가 같이 쓰는 객체의 필드**가 위험해요.
@@K Life cycle of a thread
```
new Thread()  →  New
   start()    →  Runnable  ⇄  Running (스케줄러가 고름)
                   ↑   ↓ sleep, wait, join, 락 대기
                 Blocked (Non-Runnable)
   run() 끝   →  Terminated
```
`isAlive()`: New이면 false, start 후 끝나기 전까지 true, Terminated면 false. (직접 확인: 만든 직후 `NEW false`, 끝난 뒤 `TERMINATED false`.)

참고: Java의 실제 `Thread.State`에는 Running이 따로 없고 NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED가 있어요. 수업의 5단계는 개념 그림이에요.
@@K Defining a Thread
| | extends Thread | implements Runnable |
| --- | --- | --- |
| 시작 | `new MyThread().start()` | `new Thread(new MyRunnable()).start()` |
| 장점 | 짧음 | 다른 클래스를 **상속할 수 있음**(Java는 단일 상속) |

보통은 **Runnable**을 추천해요. Runnable은 메서드가 `run()` 하나뿐인 함수형 인터페이스라서 람다로도 돼요(Week 10): `new Thread(() -> System.out.println("hi")).start();`
@@K Runnable Interface
`Runnable`은 `public void run()` 하나만 있는 인터페이스. 스레드가 할 일을 `run()`에 써요. `run()`은 파라미터도 없고 반환값도 없어요(void). 결과를 돌려받고 싶으면 `Callable`(풀에서 `submit`)을 써요.
@@K Creating and Starting a Thread
순서 4단계: Runnable 구현 클래스 만들기 → 객체 만들기 → `new Thread(r)`로 감싸기 → **`start()`**.

`start()`가 하는 일: 새 스레드를 만들고, 그 스레드에서 `run()`을 불러요. 우리가 `run()`을 직접 부르는 게 아니에요.
@@K Thread Scheduler in Java
스케줄러는 JVM의 일부로, Runnable 상태 스레드 중 **누구를 실행할지** 골라요. 순서는 **보장 없음**. 그래서 같은 코드도 실행할 때마다 출력이 달라요.

- **Preemptive**(선점형): 우선순위 높은 스레드가 먼저, 기다리거나 끝날 때까지 실행.
- **Time slicing**: 정해진 시간만큼 돌고 다시 대기 줄로.

우선순위(`setPriority`)는 "힌트"일 뿐 순서를 보장하지 않아요.
@@K Can we start the same thread twice?
안 돼요. 두 번째 `start()`에서 `IllegalThreadStateException`. 직접 돌려 보면 예외 메시지가 "running..."보다 **먼저** 찍히기도 해요. 첫 스레드가 아직 출력하기 전에 main이 두 번째 start를 했기 때문이에요(순서 보장 없음의 좋은 예).
@@K Calling run() directly
- `run()` 두 번: main 스레드 하나가 첫 번째 run(1 2 3 4)을 끝내고 두 번째 run(1 2 3 4). 총 약 4초.
- `start()` 두 번: 두 스레드가 동시에 → `1 1 2 2 3 3 4 4`처럼 섞임. 총 약 2초.

시험 문제: "run()을 직접 부르면?" → 새 스레드 없음, 순서대로 실행.
@@K sleep
`Thread.sleep(500)`: **지금 실행 중인 스레드**를 0.5초 멈춤. static 메서드라서 `t1.sleep()`이라고 써도 t1이 아니라 **현재 스레드**가 자요(함정).

자는 동안 스케줄러는 다른 스레드를 실행해요. sleep은 **락을 놓지 않아요**.
@@K join
`t1.join()` = "main(지금 스레드)은 **t1이 끝날 때까지** 기다려". 그래서 t1이 1~5를 다 출력한 뒤에 t2, t3가 시작해서 둘이 섞여 나와요(1 1 2 2 ...).

`join()`도 InterruptedException을 던져요.
@@K Thread methods
| 메서드 | 뜻 |
| --- | --- |
| `getName()` / `setName()` | 이름(기본 `Thread-0`, `Thread-1` ...) |
| `getId()` | 번호 |
| `Thread.currentThread()` | **지금 이 코드를 실행 중인** 스레드 |
| `isAlive()` | 시작했고 아직 안 끝났으면 true |
| `interrupt()` | 깨우기 신호. 자고/기다리는 중이면 InterruptedException 발생 |
| `isInterrupted()` | 신호 받았는지 확인 |
| `setPriority(1~10)` | MIN 1, NORM 5(기본), MAX 10 |

⚠️ 슬라이드 원본의 `interupt()`, `isInterupt()`는 오타예요. 정확히는 `interrupt()`, `isInterrupted()`. 그리고 InterruptedException은 `java.io`가 아니라 **`java.lang`** 패키지예요.
@@K Thread Pools
작업마다 `new Thread()`를 만들면 만들고 없애는 비용이 커요. **스레드 풀** = 스레드 몇 개를 미리 만들어 두고 작업을 차례로 맡기는 것. 식당에 손님마다 요리사를 새로 뽑지 않고, 요리사 몇 명이 주문을 돌아가며 처리하는 것과 같아요.
@@K Java Executor
- `Executor`: `execute(Runnable)` 하나만 있는 인터페이스.
- `ExecutorService`: Executor의 자식. `shutdown()`, `submit()` 등 관리 기능.
- `Executors`: 풀을 만드는 **공장 클래스**(static 메서드).

| 풀 | 동작 |
| --- | --- |
| `newFixedThreadPool(1)` | 스레드 1개 → 작업 3개가 **하나씩 순서대로** |
| `newFixedThreadPool(3)` | 3개 동시 |
| `newCachedThreadPool()` | 필요하면 새 스레드 → 전부 동시 |

다 쓰면 `executor.shutdown()`을 불러야 프로그램이 끝나요(안 부르면 풀 스레드가 남아서 안 꺼짐).

⚠️ 슬라이드 원본의 `newCashedThreadPool`은 오타, 정확히는 **`newCachedThreadPool`**.

@@SLIDE week-11-2-synchronization.md
@@S _doc | read
여러 스레드가 같은 데이터를 동시에 바꿀 때 생기는 문제(race condition)와, `synchronized`로 막는 방법, 그리고 데드락을 배워요.
@@S Synchronized Method | type
할 일: Table.printTable을 synchronized 없이, 있이 각각 돌려서 5와 100의 배수가 섞이는지 비교
@@S Deadlock | type
할 일: 데드락 예제를 돌려 두 줄만 찍히고 멈추는 것 확인, 그다음 t2도 resource1을 먼저 잠그게 바꿔서 해결
@@K Thread Synchronization
공유 자원(같은 은행 계좌 객체)을 여러 스레드가 동시에 건드리면 값이 **깨질 수** 있어요. 동기화 = 한 번에 한 스레드만 들어가게 줄 세우기.
@@K Race Condition
잔액 100에서 John과 Anita가 동시에 75를 출금:
1. Anita가 `balance >= 75` 확인 → 통과 → 여기서 스케줄러가 멈춤
2. John도 `balance >= 75` 확인 → 통과(아직 100) → 빼서 25
3. Anita가 다시 실행 → 이미 확인했으니 빼서 **-50**

"확인"과 "빼기" 사이에 다른 스레드가 끼어들어서 생긴 문제예요. 직접 해 보면 4개 스레드가 `count++`를 10만 번씩 해도 400000이 아니라 237609처럼 **매번 다른 작은 값**이 나와요. `count++`도 읽기, 더하기, 쓰기 3단계라서 끼어들 수 있거든요.
@@K Synchronization Concept
모든 객체는 **자물쇠(intrinsic lock, monitor lock)**를 하나씩 갖고 있어요.
- synchronized에 들어가려면 그 자물쇠를 **가져야** 해요.
- 다른 스레드가 갖고 있으면 **Blocked**로 기다려요.
- 끝나면 자물쇠를 놓고, 기다리던 스레드 중 하나가 가져가요.

화장실 열쇠가 하나뿐인 카페를 생각하면 돼요.
@@K Types of Synchronization
1. **Mutual Exclusive**(상호 배제): 한 번에 하나만. synchronized 메서드, 블록, static.
2. **Cooperation**(협력): 스레드끼리 신호 주고받기. wait/notify (Segment 3).
@@K Synchronized Method
`synchronized void printTable(...)`: 이 메서드에 들어가려면 **`this` 객체의 락**이 필요해요. 두 스레드가 **같은 `obj`**를 쓰니까 하나가 5단을 다 찍을 때까지 다른 하나는 기다려요.

결과(직접 확인): `5 10 15 20 25 100 200 300 400 500`. synchronized를 빼면 `5 100 10 200 ...`처럼 섞여요. (5단과 100단 중 어느 쪽이 먼저일지는 보장 없음.)
@@K Synchronized Block
메서드 전체가 아니라 **꼭 필요한 부분만** 잠가요. `synchronized(this)`의 괄호 안에 **어떤 객체의 락**을 쓸지 적어요.

예제에서 `lastName`, `nameCount`를 바꾸는 부분만 잠그고 `studentList.add`는 밖에 둬서 다른 스레드가 덜 기다려요. 잠그는 범위가 작을수록 성능이 좋아요.
@@K Static Synchronization
`static synchronized` 메서드는 객체가 아니라 **클래스(Table.class)의 락**을 써요.

| | t1, t2 → object1 / t3, t4 → object2 |
| --- | --- |
| synchronized 메서드 | t1과 t2는 서로 막힘, **t1과 t3는 안 막힘**(락이 다름) |
| static synchronized | 클래스 락이 하나라 **모두** 서로 막힘 |

블록으로는 `synchronized (Table.class) { }`와 같아요.
@@K Deadlock
t1: resource1 잠금 → 0.1초 잠 → resource2 기다림
t2: resource2 잠금 → 0.1초 잠 → resource1 기다림

서로 상대가 가진 걸 기다리니 **영원히** 멈춰요. 출력은 두 줄("locked resource 1", "locked resource 2")에서 끝. 예외도 안 나고 프로그램이 안 꺼져요.

해결의 기본: **모든 스레드가 같은 순서로 락을 잡기**(둘 다 resource1 → resource2). 그러면 한 스레드가 resource1을 잡는 동안 다른 스레드는 처음부터 기다려서 꼬이지 않아요.

@@SLIDE week-11-3-communication.md
@@S _doc | read
스레드끼리 "기다려", "이제 해도 돼"라고 **신호를 주고받는** 방법(wait, notify, notifyAll)을 배워요.
@@S Example: Using Monitor | type
할 일: 잔액 10000에서 15000 출금 스레드를 먼저, 10000 입금 스레드를 나중에 시작해서 출금이 입금 뒤에 완료되는지 확인
@@K Java Monitors
모니터 = **락 + 대기실**이 있는 객체. Java에서는 모든 객체가 모니터가 될 수 있어요. synchronized로 들어가면(락 획득) 모니터 안, 나오면(락 해제) 밖. 안에서 조건이 안 맞으면 대기실에서 `wait()`.

참고: Java 5부터는 `Lock`, `Condition`(await, signal, signalAll)도 있고 더 유연해요. 하는 일은 wait/notify/notifyAll과 대응돼요.
@@K Guarded Blocks
"조건이 맞을 때까지 기다리는 블록"이 guarded block이에요.

| 메서드 | 뜻 |
| --- | --- |
| `wait()` | 락을 **놓고** 대기실로. notify가 올 때까지 잠 |
| `notify()` | 대기실의 **하나**를 깨움(누구일지 모름) |
| `notifyAll()` | 대기실의 **전부**를 깨움 |

세 개 모두 **`Object` 클래스**의 메서드예요(Thread가 아님). 어느 객체에서 기다리는지가 중요하니까요.
@@K Inter-thread communication process
1~2. 여러 스레드가 락을 원하고, 하나가 잡아요.
3. 조건이 안 맞으면 `wait()` → 락을 놓고 대기.
4. 다른 스레드가 `notify()` → 깨어나서 Runnable로.
5. 바로 실행이 아니라 **락을 다시 잡아야** 이어서 실행.
6. 일을 끝내고 락 해제.

포인트: 깨어나도 notify한 스레드가 synchronized를 나갈 때까지는 못 들어가요.
@@K Example: Using Monitor
흐름(직접 확인):
```
going to withdraw...                ← 10000 < 15000 이라 wait (락 놓음)
Less balance; waiting for deposit...
going to deposit...                 ← 락을 잡을 수 있음
deposit completed...                ← 20000, notify
withdraw completed...               ← 깨어나서 15000 빼고 5000
```
`wait()`이 락을 놓지 않았다면 deposit은 영원히 못 들어가서 데드락이었을 거예요.

synchronized 밖에서 `wait/notify`를 부르면 `IllegalMonitorStateException: current thread is not owner`(직접 확인).

⚠️ 슬라이드 원본은 `if (this.amount < amount) wait();`로 `if`를 써요. 아래 idiom처럼 **`while`**이 맞아서 위 발췌는 while로 고쳤어요. if면 깨어났을 때 잔액이 여전히 부족해도 그냥 빼 버려요.
@@K wait() Method Idiom
규칙: **wait은 항상 while 안에서**.
```java
while (!조건) wait();
```
이유: 깨어났다고 조건이 맞는다는 보장이 없어요. notifyAll로 여러 명이 깨면 다른 스레드가 먼저 조건을 써 버렸을 수 있고, 이유 없이 깨는 경우(spurious wakeup)도 있어요. while이면 다시 확인하고 아니면 또 기다려요.
@@K notifyAll() Method Idiom
조건을 바꾼 쪽(`examResult = true`)이 `notifyAll()`로 알려요. 이것도 synchronized 안에서.

`notify()` vs `notifyAll()`: notify는 하나만, **누구를 깨울지 고를 수 없어요**. 엉뚱한 스레드를 깨우면 진짜 기다리던 스레드는 계속 잠들 수 있어서, 확실하지 않으면 notifyAll이 안전해요.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 11

주문 "결제" 버튼을 누르면 결제 처리(2초 `sleep`으로 흉내)를 **백그라운드 스레드**에서 하고, 그동안 화면은 멈추지 않게 해요. 끝나면 `Platform.runLater(() -> statusLabel.setText("Paid"))`로 화면을 바꿔요(JavaFX 화면은 FX 스레드에서만 바꿔야 해요). 주문 번호 카운터는 `synchronized` 메서드로 중복 번호가 안 나오게. (토이 가이드는 준비 중이에요.)

## ✅ 시험 대비 체크리스트 (Week 11)

- [ ] 스레드의 정의, 멀티스레딩의 장점, 스레드마다 가진 것(스택)과 공유하는 것(메모리)을 안다.
- [ ] extends Thread와 implements Runnable 두 방법으로 스레드를 만들고 시작할 수 있다.
- [ ] start()와 run() 직접 호출의 차이를 출력으로 설명할 수 있다.
- [ ] 생명주기 5단계와 isAlive() 값을 안다.
- [ ] 같은 스레드를 두 번 start하면 IllegalThreadStateException임을 안다.
- [ ] sleep과 join의 의미, InterruptedException 처리를 안다.
- [ ] newFixedThreadPool과 newCachedThreadPool의 차이, shutdown을 안다.
- [ ] race condition을 은행 예로 설명할 수 있다.
- [ ] synchronized 메서드, 블록, static synchronized가 각각 어떤 락을 쓰는지 안다.
- [ ] 데드락이 생기는 조건과 락 순서로 막는 법을 안다.
- [ ] wait, notify, notifyAll이 Object의 메서드이고 synchronized 안에서만 불러야 함을 안다.
- [ ] wait은 락을 놓고 sleep은 놓지 않음, wait은 while 안에서 써야 함을 안다.

## ✍️ 손으로 써 보기

1. 1부터 3까지 출력하는 작업을 Runnable 람다로 만들어 스레드 두 개로 실행하고, main은 두 스레드가 끝난 뒤 "done"을 출력하게 쓰세요.

<details><summary>1번 예시 답</summary>

```java
public static void main(String[] args) throws InterruptedException {
    Runnable task = () -> {
        for (int i = 1; i <= 3; i++)
            System.out.println(Thread.currentThread().getName() + ": " + i);
    };
    Thread a = new Thread(task);
    Thread b = new Thread(task);
    a.start();
    b.start();
    a.join();
    b.join();
    System.out.println("done");
}
```

</details>

2. 아래 `Counter`를 스레드 4개가 1000번씩 `increment()`했는데 4000이 안 나와요. 두 가지 고치는 방법을 쓰세요.

```java
class Counter {
    private int count = 0;
    void increment() { count++; }
    int get() { return count; }
}
```

<details><summary>2번 정답</summary>

(1) 메서드에 `synchronized void increment() { count++; }`
(2) 블록으로 `void increment() { synchronized (this) { count++; } }`
(참고로 `AtomicInteger`의 `incrementAndGet()`도 방법이에요.) 그리고 결과를 읽기 전에 네 스레드 모두 `join()` 해야 해요.

</details>

3. 다음 중 틀린 문장을 고르세요.
   - (a) `wait()`은 락을 놓고 기다린다.
   - (b) `sleep()`은 락을 쥔 채로 잔다.
   - (c) `notify()`는 synchronized 밖에서도 부를 수 있다.
   - (d) `wait()`은 Object 클래스의 메서드다.

<details><summary>3번 정답</summary>

(c). synchronized 밖에서 부르면 `IllegalMonitorStateException`.

</details>
