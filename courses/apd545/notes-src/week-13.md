# Week 13. 네트워킹과 소켓, 스레드 풀과 JDBC 커넥션 풀

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. 슬라이드에 단계 설명만 있는 서버, 클라이언트, 풀 코드는 그 단계대로 **해설용으로 새로 쓴 예시**예요(소켓과 스레드 풀은 직접 돌려 확인했어요). ⌨️ 표시가 있는 코드는 IntelliJ에서 직접 쳐 보세요.
>
> 이번 주는 앞에서 배운 걸 합치는 주예요. 소켓 통신은 Week 9 **IO 스트림** 그대로, 여러 클라이언트를 받으려면 Week 11 **스레드**, 커넥션 풀은 Week 8 **JDBC**와 Week 11 **스레드 풀** 아이디어예요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 시험에 나오는 모양 |
| --- | --- | --- |
| Client / Server | 서버는 서비스 제공하며 기다림, 클라이언트가 접속 | 브라우저, MySQL Workbench |
| TCP | **연결형**, 신뢰성, 순서 보장. 전화 | HTTP, FTP, telnet |
| UDP | **비연결형**, datagram, 도착 보장 없음. 편지 | clock server |
| IPv4 / IPv6 | 32비트 점 4개 / 128비트 16진수 콜론 | |
| Port | **16비트**, 0~65535. 0~1023은 예약(well-known) | 어느 앱에 줄지 |
| Socket | 양방향 통신의 **한쪽 끝** | |
| ServerSocket | `new ServerSocket(port)`, `accept()`가 Socket 반환 | accept는 기다림(블로킹) |
| 클라이언트 | `new Socket(host, port)` | 서버가 먼저 떠 있어야 |
| 통신 | `getInputStream()`, `getOutputStream()` + Data/Object 스트림 | 보낸 형식대로 읽기 |
| InetAddress | `getHostName()`, `getHostAddress()` | 누가 접속했나 |
| 멀티스레드 서버 | accept 루프 + 클라이언트마다 스레드 | |
| Pooling | 미리 만들어 두고 **재사용** | 장점 2개 |
| Connection Pool | 연결을 빌리고 `close()`하면 **풀에 반납** | 설정값들 |
| Thread Pool 장단점 | 재사용, 응답성, 개수 관리 / 너무 많으면 전환 비용, 거절 정책 | |

**함정 모음**

- 서버가 안 떠 있는데 클라이언트가 접속하면 `ConnectException: Connection refused`(직접 확인).
- `accept()`는 클라이언트가 올 때까지 **멈춰서 기다려요**. JavaFX 화면 스레드에서 부르면 창이 멈춰요 → 별도 스레드에서.
- 서버가 `writeDouble`로 보냈으면 클라이언트는 `readDouble`로. ObjectOutputStream이면 ObjectInputStream으로. **형식과 순서를 맞춰야** 해요.
- 포트는 16비트, IP(IPv4)는 32비트. 숫자를 헷갈리지 말 것.
- 커넥션 풀에서 `conn.close()`는 진짜로 끊는 게 아니라 **풀에 돌려주는 것**. 그래도 반드시 불러야 해요(안 부르면 풀이 바닥남).
- 스레드 풀이 크다고 빠른 게 아니에요. 코어 수는 정해져 있어서 너무 많으면 **오히려 느려져요**.

{{PRACTICE}}

{{TOC}}

@@SLIDE week-13-1-sockets.md
@@S _doc | read
컴퓨터끼리 대화하는 법(TCP, UDP, IP, Port)과, Java 소켓으로 서버와 클라이언트를 만드는 단계를 배워요. 통신 부분은 Week 9 스트림과 똑같아요.
@@S Server Steps | type
할 일: 8000번 포트에서 반지름(double)을 받아 넓이를 돌려주는 서버를 만들고 실행해 두기
@@S Client Steps | type
할 일: 서버에 2.0을 보내 Area: 12.566...이 나오는지 확인, 서버를 끄고 다시 실행해 ConnectException도 보기
@@S Multi-threaded Server | type
할 일: 서버를 while 루프 + 클라이언트마다 스레드로 바꾸고 클라이언트 두 개를 연달아 실행
@@K Network
네트워크 = 컴퓨터를 연결해서 **자원 공유**(프린터, 파일)와 **통신**을 하는 것. 인트라넷 = 회사 안의 사설 네트워크. 네트워크에 연결된 컴퓨터 한 대를 **host**라고 불러요.

같은 컴퓨터 안의 프로그램끼리도 네트워크로 대화할 수 있어요. 이때 주소가 `localhost`(127.0.0.1).
@@K Client/Server
- **서버**: 서비스를 제공하며 **기다리는** 쪽(웹 서버, DB 서버).
- **클라이언트**: 서비스를 **요청하는** 쪽(브라우저, MySQL Workbench, 우리 JavaFX 앱).

Week 8에서 JavaFX 앱이 MySQL에 접속한 것도 클라이언트/서버였어요. 같은 컴퓨터에 둘 다 있어도 구조는 같아요.
@@K Network Communications and Ports
컴퓨터에 들어오는 데이터는 랜선/와이파이 하나로 다 들어와요. 브라우저, 채팅, 음악 중 **누구 것인지** 어떻게 알까? → **포트 번호**.

비유: IP 주소 = 아파트 주소, 포트 = 호수. 주소로 건물을 찾고 호수로 집(앱)을 찾아요.
@@K TCP
TCP = **전화 통화**. 먼저 연결하고(전화 걸기), 말한 순서대로 다 전달되고(신뢰성, 순서 보장), 끝나면 끊어요.

단점: 연결을 맺는 데 시간이 걸리고, 통화 중엔 말을 안 해도 회선을 잡고 있어요(대역폭 점유), 끝날 때 명시적으로 끊어야 해요.

HTTP, FTP, telnet이 TCP 위에서 돌아요. Java의 `Socket`, `ServerSocket`은 **TCP**예요.
@@K Communication steps TCP
1. 클라이언트가 연결 열기 → 2. 요청 보내기 → 3. 서버가 응답 → 4. 클라이언트가 연결 닫기. 2, 3은 여러 번 반복 가능(한 번 연결하고 여러 번 주고받기).
@@K UDP
UDP = **편지(엽서)**. 연결 없이 패킷(datagram)을 그냥 보내요. 도착 보장 없음, 순서 보장 없음, 하나하나 독립.

빠르고 가벼워서 시간 서버, 영상 스트리밍, 게임처럼 "조금 빠져도 괜찮고 빠른 게 중요한" 곳에 써요. Java에서는 `DatagramSocket`, `DatagramPacket`.

| | TCP | UDP |
| --- | --- | --- |
| 연결 | 연결형 | 비연결형 |
| 신뢰성 | 보장 | 보장 없음 |
| 순서 | 보장 | 보장 없음 |
| 비유 | 전화 | 편지 |
@@K IPv4 and IPv6
- **IPv4**: 32비트, `192.168.0.10`처럼 0~255 숫자 4개를 점으로. 약 43억 개라 부족해짐.
- **IPv6**: 128비트, `2001:db8::1`처럼 16진수를 콜론으로.

IP는 **컴퓨터**를, 포트(16비트)는 그 안의 **앱**을 찾아요.
@@K Port numbers
16비트 → 0 ~ 65535 (2^16 - 1). 0~1023은 **well-known**(HTTP 80, HTTPS 443, FTP 21 등) 예약이라 우리 앱은 쓰지 말아야 해요. 그래서 예제는 8000번처럼 1024 이상을 써요. 이미 다른 프로그램이 쓰는 포트로 ServerSocket을 만들면 `BindException`.
@@K Java Networking
`java.net` 패키지:
- **저수준**: `Socket`, `ServerSocket`, `DatagramSocket`. 바이트를 직접 주고받기.
- **고수준**: `URL`, `URI`, `URLConnection`. 웹 주소로 자원 가져오기.

프로토콜을 알아야 하는 이유: 믿을 수 있어야 하면 TCP(Socket), 빠른 게 중요하면 UDP(DatagramSocket)처럼 **어떤 클래스를 쓸지** 고르려고.
@@K Sockets
소켓 = 두 프로그램 사이 양방향 통신선의 **한쪽 끝**(전화기 한 대). 서버 쪽 소켓과 클라이언트 쪽 소켓이 짝을 이뤄요. 각 소켓에서 읽기(InputStream), 쓰기(OutputStream)를 할 수 있어요.
@@K What is Socket?
1. 서버는 특정 포트(8000)에 ServerSocket을 열고 **기다려요**.
2. 클라이언트는 서버의 **호스트 이름과 포트**를 알고 접속 요청.
3. 서버가 받아들이면(`accept`) **새 Socket**을 만들어서 이 클라이언트와 대화해요.

왜 새 소켓? 원래 ServerSocket은 계속 **다음 손님을 받는 문** 역할을 해야 하니까요. 식당 입구 직원(ServerSocket)이 손님을 자리로 안내하면 담당 웨이터(새 Socket)가 주문을 받는 것과 같아요.
@@K Client/Server Communications
그림 요약:
- 서버: `new ServerSocket(8000)` → `server.accept()` (기다림) → Socket
- 클라이언트: `new Socket(host, 8000)` → Socket
- 연결 후: 양쪽 다 Socket의 스트림으로 읽고 쓰기. **Week 9 IO와 완전히 같아요.**

순서: **서버를 먼저** 실행해야 해요.

⚠️ 슬라이드 원본의 `SeverSocket`, `newDataOutputStream`은 오타예요(`ServerSocket`, `new DataOutputStream`).
@@K Server Steps
서버 5단계:
1. `new ServerSocket(port, queueLength)`: 포트 등록. queueLength = 대기 줄 최대 길이.
2. `accept()`: 클라이언트가 올 때까지 **멈춰서** 기다렸다가 Socket 반환.
3. `getInputStream()`, `getOutputStream()`: 보통 `DataInputStream`/`DataOutputStream`이나 Object 스트림으로 감싸요(Week 9의 Decorator 감싸기).
4. 처리: 받고, 계산하고, 보내기.
5. 닫기: 예시는 try-with-resources라 자동으로 닫혀요.

예시 계산: 반지름 2.0 → 2 × 2 × π = **12.566370614359172** (직접 확인).
@@K Socket and ServerSocket classes
| 클래스 | 누가 | 핵심 메서드 |
| --- | --- | --- |
| `ServerSocket` | 서버만 | `accept()`, `close()` |
| `Socket` | 양쪽 다 | `getInputStream()`, `getOutputStream()`, `close()` |

클라이언트는 ServerSocket을 쓰지 않아요.
@@K The InetAddress Class
서버가 "누가 접속했지?"를 알고 싶을 때. `socket.getInetAddress()`로 받아서 `getHostName()`(이름), `getHostAddress()`(IP 문자열). 같은 컴퓨터에서 테스트하면 `127.0.0.1`(직접 확인).

`InetAddress.getByName("localhost")`처럼 이름으로 직접 만들 수도 있어요.
@@K Client Steps
클라이언트 4단계: Socket 만들기 → 스트림 얻기 → 처리 → 닫기.

- 서버가 **보낸 형식 그대로** 읽어야 해요. 서버가 `writeDouble`이면 `readDouble`, `ObjectOutputStream`이면 `ObjectInputStream`.
- `flush()`: 버퍼에 남은 데이터를 지금 보내기. 안 하면 서버가 영원히 기다릴 수 있어요.
- 서버가 없으면 `ConnectException: Connection refused`.

주의: Object 스트림을 양쪽에서 만들 때, `ObjectInputStream` 생성자는 상대가 보낸 헤더를 기다려요. 양쪽 다 Input부터 만들면 서로 기다리며 멈출 수 있어서 **Output을 먼저** 만드는 게 안전해요.
@@K Multi-threaded Server
서버 5단계 그대로면 손님 **한 명**만 받고 끝나요. 실제 서버는:
1. `while (true)`로 계속 `accept()`.
2. 손님마다 **새 스레드**(Week 11)에서 대화.

그래서 한 손님과 대화 중에도 다른 손님을 받을 수 있어요. 손님이 아주 많으면 스레드를 무한히 만들지 말고 **스레드 풀**(`pool.execute(() -> handleClient(socket))`)로. 이게 다음 Segment로 이어져요.

@@SLIDE week-13-2-pooling.md
@@S _doc | read
비싼 자원(스레드, 메모리, DB 연결)을 **미리 만들어 두고 재사용하는** 풀링 기술을 배워요. 스레드 풀과 JDBC 커넥션 풀이 핵심이에요.
@@S Thread Pool | type
할 일: 스레드 2개짜리 풀에 작업 5개를 넣고 스레드 이름이 thread-1, thread-2 두 개만 나오는지 확인
@@K Thread Pools: why?
효율을 올리는 방법은 스레드 쓰기, 그리고 **스레드 풀** 쓰기. 실제 서비스(production)에서는 거의 항상 풀을 써요. 스레드를 만들고 없애는 비용이 생각보다 크거든요.
@@K Pooling Technology
풀링 = **미리 준비 + 재사용**. 객체 하나 만들 때 Java가 하는 일: 클래스 찾기, 필요하면 로딩, 힙 메모리 찾아서 할당하고 0으로 초기화, 생성자 실행. 다 시간이 들어요. 자주 쓰는 비싼 것은 한 번 만들어 두고 돌려 쓰자는 것.

비유: 놀이공원 우산 대여함. 비 올 때마다 우산을 사지 않고 빌려 쓰고 반납.
@@K Application of Pooling Technology
풀링 예: **스레드 풀**, **메모리 풀**, **DB 커넥션 풀**, HttpClient 커넥션 풀. 시험에는 "풀링이 쓰이는 곳"으로 이 목록이 나올 수 있어요.
@@K Thread Pool
스레드 N개를 미리 띄워 두고 **잠자게** 해요. 요청이 오면 하나를 깨워서 처리, 끝나면 다시 잠. 요청마다 새로 만들지 않아요.

예: 초당 100개 넘는 요청이 오는 은행 시스템에서 요청마다 스레드를 만들면 CPU와 메모리가 감당 못 해요. 200개짜리 풀이면 그 자원을 실제 업무에 써요.

예시 출력 (직접 확인): 작업은 5개인데 스레드 이름은 `pool-1-thread-1`, `pool-1-thread-2` **두 개만** 나와요. 같은 스레드가 재사용된 증거예요. (어느 스레드가 어느 작업을 맡을지는 실행마다 달라요.)
@@K Memory Pool
큰 메모리 덩어리를 미리 잡아 두고, 요청마다 빈 조각을 "사용 중"으로 표시해서 줘요. 다 쓰면 진짜로 해제하지 않고 풀에 "빈 칸"으로 돌려놔요. 앱이 끝날 때 풀 전체를 해제.

| 장점 | 단점 |
| --- | --- |
| 메모리 **단편화**(조각조각 빈 공간) 감소, 재사용 증가 | 처음에 크게 잡아서 안 쓰는 부분이 **낭비** |

(Java는 GC가 메모리를 관리해서 직접 쓸 일은 적어요. 개념만 알아 두세요.)
@@K Database Connection Pool
DB 연결(`DriverManager.getConnection`)은 네트워크 접속, 로그인 확인까지 해서 **아주 느려요**. 그래서:
1. 프로그램 시작 때 연결 여러 개를 미리 만들어 풀에 둬요.
2. 필요하면 `dataSource.getConnection()`으로 **놀고 있는 연결을 빌려요**.
3. `close()`하면 진짜 끊는 게 아니라 **풀에 반납**.

설정할 수 있는 값: 처음 연결 수, 최소/최대 연결 수, 연결 하나의 최대 사용 횟수, 최대 유휴 시간. 풀이 연결 상태를 감시(monitoring)도 해요.

예시 코드에서 Week 8과 달라진 건 `DriverManager` 대신 `dataSource` 한 줄뿐이에요. 그래서 try-with-resources를 그대로 쓰면 자동으로 반납돼요. (실제로는 HikariCP 같은 라이브러리가 DataSource를 만들어 줘요. 이 예시는 DB가 있어야 돌아가서 직접 실행은 안 했어요.)
@@K Thread Pool separates threads and tasks
풀의 핵심 아이디어: **스레드(일꾼)**와 **작업(할 일)**을 분리. 작업은 Runnable로 풀에 넣기만 하고, 어느 일꾼이 할지는 풀이 정해요. 일꾼은 한 번 만들어지면 풀에 남아서 다음 작업을 기다려요.
@@K Advantages of Thread Pools
1. **자원 절약**: 스레드마다 스택, 프로그램 카운터 같은 전용 공간이 필요한데, 재사용하니 만들고 없애는 비용이 줄어요.
2. **빠른 응답**: 이미 있는 스레드가 바로 일을 시작해요.
3. **개수 관리**: 고정 개수라 스레드가 무한히 늘어나는 걸 막아요.
@@K Disadvantages of Thread Pools
- 스레드를 **너무 많이** 두면 오히려 느려져요. 코어 수는 정해져 있어서 스레드끼리 경쟁하고 **전환(context switch)**에 시간을 써요. 적절한 개수가 핵심(보통 코어 수 근처, IO가 많으면 더).
- 작업이 끝없이 쌓이면 메모리가 부족해져요. 그래서 대기 작업 수에 한도를 두고 넘치면 **거절 정책(rejection policy)**으로 처리해요.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 13

주방을 **별도 프로그램**으로 분리해요. `KitchenServer`가 9000번 포트에서 `while (true) accept()`하고 손님마다 스레드 풀에서 처리. CafeOrder 앱은 주문할 때 `Socket`으로 접속해서 `ObjectOutputStream`으로 `Order`(Week 9에서 Serializable로 만든 것)를 보내고, 서버는 "Order #12 received"를 돌려줘요. DB 저장은 커넥션 풀로. (토이 가이드는 준비 중이에요.)

## ✅ 시험 대비 체크리스트 (Week 13)

- [ ] 네트워크, host, intranet, 클라이언트/서버를 예로 설명할 수 있다.
- [ ] TCP와 UDP의 차이(연결, 신뢰성, 순서, 비유, 예)를 표로 쓸 수 있다.
- [ ] TCP 통신 4단계를 순서대로 말할 수 있다.
- [ ] IPv4(32비트)와 IPv6(128비트), 포트(16비트, 0~65535, 0~1023 예약)를 안다.
- [ ] 소켓의 정의와, 서버가 accept 후 새 소켓을 만드는 이유를 안다.
- [ ] 서버 5단계와 클라이언트 4단계를 코드로 쓸 수 있다.
- [ ] Socket과 ServerSocket의 메서드, InetAddress 사용법을 안다.
- [ ] 보낸 형식대로 읽어야 하는 이유와 flush의 역할을 안다.
- [ ] 멀티스레드 서버 구조(accept 루프 + 클라이언트당 스레드)를 쓸 수 있다.
- [ ] 풀링의 두 장점(미리 준비, 재사용)과 쓰이는 곳 4가지를 안다.
- [ ] DB 커넥션 풀의 동작(빌리기, close로 반납)과 설정값을 안다.
- [ ] 스레드 풀의 장점 3가지와 단점(전환 비용, 거절 정책)을 안다.

## ✍️ 손으로 써 보기

1. 클라이언트가 보낸 문자열을 대문자로 바꿔 돌려주는 서버(포트 7000)와 클라이언트를 쓰세요. `DataInputStream.readUTF`/`DataOutputStream.writeUTF`를 쓰세요.

<details><summary>1번 예시 답</summary>

```java
// Server
try (ServerSocket server = new ServerSocket(7000);
     Socket socket = server.accept();
     DataInputStream in = new DataInputStream(socket.getInputStream());
     DataOutputStream out = new DataOutputStream(socket.getOutputStream())) {
    String msg = in.readUTF();
    out.writeUTF(msg.toUpperCase());
}

// Client
try (Socket socket = new Socket("localhost", 7000);
     DataOutputStream out = new DataOutputStream(socket.getOutputStream());
     DataInputStream in = new DataInputStream(socket.getInputStream())) {
    out.writeUTF("hello apd545");
    out.flush();
    System.out.println(in.readUTF());   // HELLO APD545
}
```

</details>

2. 빈칸을 채우세요.
   - (a) 신뢰성 있고 순서가 보장되는 연결형 프로토콜은 ____.
   - (b) 포트 번호는 ____비트라서 최대값이 ____.
   - (c) 서버에서 클라이언트 접속을 기다렸다가 Socket을 돌려주는 메서드는 ____.
   - (d) 커넥션 풀에서 빌린 연결에 `close()`를 하면 ____.

<details><summary>2번 정답</summary>

(a) TCP, (b) 16, 65535, (c) `ServerSocket.accept()`, (d) 연결이 끊기지 않고 풀에 반납된다.

</details>

3. 아래 서버는 두 번째 클라이언트를 받지 못해요. 이유와 고치는 방법은?

```java
ServerSocket server = new ServerSocket(8000);
Socket socket = server.accept();
handleClient(socket);
server.close();
```

<details><summary>3번 정답</summary>

`accept()`를 한 번만 부르고 서버를 닫아서예요. `while (true)` 안에서 `accept()`를 반복하고, 각 손님은 새 스레드나 스레드 풀(`pool.execute(() -> handleClient(socket))`)에서 처리하면 한 손님을 처리하는 동안에도 다음 손님을 받을 수 있어요.

</details>
