Source: <APD545 Week 13 · Segment 1 "Networking and Sockets" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌. 서버/클라이언트 전체 코드는 슬라이드 단계대로 해설용으로 새로 쓴 예시>
# Week 13 · Segment 1. Networking Basics and Sockets

## Network

> A network is a system of computers connected together so they can **share resources and communicate**. An **Intranet** is a private network (e.g., printers shared in a business). In networking a machine is usually referred to as a **host**.

## Client/Server

> One (or more) hosts act as **servers**, and the other hosts are **clients** that connect to the server. The browser is a client; MySQL Workbench is a client that connects to the MySQL database server. Client and server can be on the **same host**.

## Network Communications and Ports

> Computers communicate using a transport protocol: **TCP** or **UDP**. A computer usually has one physical connection to the network. How does data get to the targeted application? Answer: **Ports**. Each application that needs data from the network is assigned a port.

## TCP

> A **connection-based** protocol that provides a **reliable** flow of data between two computers. Like making a **telephone call**. Used by HTTP, FTP and telnet. The **order** of data is key. Problems: a connection must be established first, held during the whole communication, closed explicitly, and it holds bandwidth even when idle.

## Communication steps TCP

> 1. The client opens a connection to the server. 2. The client sends a request. 3. The server sends a response. 4. The client closes the connection. Steps 2 and 3 may be repeated.

## UDP

> A **non-connection based** protocol that sends independent packets called **datagrams**, with **no guarantee** of arrival. Like sending a **letter** through the postal service: order is not guaranteed and each message is independent. Example: a clock server.

## IPv4 and IPv6

> **IPv4**: 32-bit addresses (over 4 billion), four integers separated by dots. **IPv6**: 128-bit addresses, written in hexadecimal separated by colons. The 32-bit IP address identifies the computer; a **16-bit** port number identifies the application.

## Port numbers

> Port numbers range from **0 to 65,535**. Well-known ports **0 to 1023** are reserved for services such as HTTP and FTP; your applications should not bind to them.

## Java Networking

> The `java.net` package has a **low-level API** (socket programming) and a **high-level API** (URLs, URIs). We need to know TCP, UDP, IP and ports to make better decisions about which Java classes to use.

## Sockets

> A socket is **one endpoint of a two-way communication link** between two programs running on the network. Socket programming can be connection-oriented (TCP) or connection-less (UDP).

## What is Socket?

> The server has a socket bound to a specific **port** and waits, listening for a connection request. The client knows the **hostname** and the **port**. When the server accepts, it gets a **new socket** so that it can continue to listen to the original socket for other connection requests.

## Client/Server Communications

> The server must be running when a client starts. After the server accepts the connection, communication is conducted **the same as for I/O streams**.

```java
// Server host
ServerSocket server = new ServerSocket(8000);
Socket socket = server.accept();            // waits for a client

// Client host
Socket socket = new Socket(host, 8000);     // request a connection
```

## Server Steps

> 1. Create a `ServerSocket(portNumber, queueLength)`. 2. Wait for a connection: `accept()` returns a Socket. 3. Get the socket's I/O streams (`getInputStream`, `getOutputStream`), often wrapped in `DataInputStream`/`DataOutputStream` or Object streams. 4. Process. 5. Close.

```java
// 예시 코드: 반지름을 받아 원의 넓이를 돌려주는 서버
try (ServerSocket serverSocket = new ServerSocket(8000);
     Socket socket = serverSocket.accept();
     DataInputStream inputFromClient = new DataInputStream(socket.getInputStream());
     DataOutputStream outputToClient = new DataOutputStream(socket.getOutputStream())) {

    double radius = inputFromClient.readDouble();
    outputToClient.writeDouble(radius * radius * Math.PI);
}
```

## Socket and ServerSocket classes

> `Socket`: `getInputStream()`, `getOutputStream()`, `close()`. `ServerSocket`: `accept()` returns the socket and establishes a connection between server and client; `close()`.

## The InetAddress Class

```java
InetAddress inetAddress = socket.getInetAddress();
System.out.println("Client's host name is " + inetAddress.getHostName());
System.out.println("Client's IP Address is " + inetAddress.getHostAddress());
```

## Client Steps

> 1. Create a Socket to connect to the server: `new Socket(serverAddress, portNumber)`. 2. Get the socket's I/O streams. If the server sends with an ObjectOutputStream, the client should read with an **ObjectInputStream** (same format). 3. Process. 4. Close the streams and the socket; the client must determine when the server is finished sending.

```java
// 예시 코드: 위 서버에 접속하는 클라이언트
try (Socket socket = new Socket("localhost", 8000);
     DataOutputStream toServer = new DataOutputStream(socket.getOutputStream());
     DataInputStream fromServer = new DataInputStream(socket.getInputStream())) {

    toServer.writeDouble(2.0);
    toServer.flush();
    System.out.println("Area: " + fromServer.readDouble());   // Area: 12.566...
}
```

## Multi-threaded Server

> Outcomes include the **multi-threaded server**: the server keeps listening and handles each client in its own thread.

```java
// 예시 코드
try (ServerSocket serverSocket = new ServerSocket(8000)) {
    while (true) {
        Socket socket = serverSocket.accept();
        new Thread(() -> handleClient(socket)).start();   // one thread per client
    }
}
```
