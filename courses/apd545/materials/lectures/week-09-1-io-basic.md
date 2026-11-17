Source: <APD545 Week 9 · Segment 1 "Java Files and Streams" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 9 · Segment 1. IO Basics: Files and Streams

## Outcomes

> Examine Input/Output classes in java. Create and use I/O streams. Differences between **Byte, Character and Buffered** Streams. Designing and developing File I/O programs.

## Files and Streams

> To use a file, it must be first **opened**. When done with a file, it **MUST be closed**. The contents of a file is ultimately reduced to a set of numbers from 0 to 255 called bytes. In JAVA, files are represented as **Stream** objects. The information that is put into a stream comes out **in the same order**.

## Streams

> Streams provide a way to send or receive information to and from files, networks, different programs, and any I/O devices. When a JAVA program starts, 3 streams are automatically created: `System.in`, `System.out`, `System.err`.
>
> JAVA contains **four** main stream-related hierarchies: **InputStream, OutputStream** (binary bytes) and **Reader, Writer** (text). There is no common Stream class; these 4 abstract classes are the roots.

## Buffers

> I/O is a bottleneck. Buffered output allows data to be collected before it is actually sent; only when the buffer gets full does the data actually get sent. `flush()` empties the buffer immediately.
>
> `System.in` is a `java.io.BufferedInputStream`, `System.out` is a `java.io.PrintStream`.

## Writing binary data: FileOutputStream

> `new FileOutputStream(String fileName)` overwrites an existing file. `new FileOutputStream(String fileName, boolean append)`: if append = true the new data is appended to the end.

```java
try {
    FileOutputStream out = new FileOutputStream("myFile.dat");
    out.write('H');
    out.write(69);
    out.write(76);
    out.write('L');
    out.write('O');
    out.write('!');
    out.close();
} catch (FileNotFoundException e) {
    System.out.println("Error: Cannot open file for writing");
} catch (IOException e) {
    System.out.println("Error: Cannot write to file");
}
```

> Two exceptions may occur: opening a file may generate **FileNotFoundException**; reading or writing may generate **IOException**. In a path string use two backslashes: `"F:\\My Documents\\myFile.dat"`.

## DataOutputStream

> A "wrapper" around the FileOutputStream that writes whole primitives and Strings: `writeInt, writeDouble, writeBoolean, writeChar, writeUTF(String)`, ... The output is in binary format.

## Reading binary data: FileInputStream

```java
FileInputStream in = new FileInputStream("myFile.dat");
while (in.available() > 0)
    System.out.print(in.read() + " ");
in.close();
```

> `read()` reads a single byte. `available()` returns the number of bytes available to be read.

## Writing text: PrintWriter

> When objects are written to the text file, the **toString()** method is called. PrintWriter behaves just like the System.out console.

```java
PrintWriter out = new PrintWriter(new FileWriter("myAccount2.dat"));
out.println(aBankAccount.getOwner());
out.println(aBankAccount.getAccountNumber());
out.println(aBankAccount.getBalance());
out.close();
```

## Reading text: BufferedReader and Scanner

> We can only read in characters and lines of text from a text file, but NOT general objects.

```java
BufferedReader in = new BufferedReader(new FileReader("myAccount2.dat"));
String name = in.readLine();
int acc = Integer.parseInt(in.readLine());
float bal = Float.parseFloat(in.readLine());
in.close();

Scanner sc = new Scanner(new FileReader("myAccount2.dat"));
String name2 = sc.nextLine();
int acc2 = sc.nextInt();
float bal2 = sc.nextFloat();
sc.close();
```

## Buffering and Chained Streams

> read()/write() of a single byte is inefficient; each call is handled by the OS. Buffering reads/writes a **block** of bytes into a memory buffer (byte array, default **8192** bytes). A buffered stream only provides buffering; it works **chained** with another stream.

```java
BufferedInputStream in = new BufferedInputStream(new FileInputStream("big.dat"));
```

## Stream IO Operations

> 1. Open stream 2. Read/Write 3. Close stream

## Standard Template

```java
FileInputStream in = null;
try {
    in = new FileInputStream(filename);
    // read data
} catch (FileNotFoundException e) {
    // ...
} finally {
    try { if (in != null) in.close(); } catch (IOException e) { }
}
```

## try-with-resources (Java 7)

> Works with `java.lang.AutoCloseable`. The stream is closed automatically.

```java
try (FileInputStream in = new FileInputStream(src);
     FileOutputStream out = new FileOutputStream(dst)) {
    // read and write
} catch (FileNotFoundException e) {
    // ...
} catch (IOException e) {
    // ...
}
```

## Byte Stream vs Character Stream

> | Byte Stream | Character Stream |
> | --- | --- |
> | "Raw Data", byte by byte (8 bits) | "Character Data", char by char (16 bits) |
> | coder converts bytes to characters | no worries for the coder |
> | does not always handle Unicode correctly | handles Unicode appropriately |
>
> Binary I/O does not involve encoding or decoding and is **more efficient** than text I/O.
