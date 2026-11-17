Source: <APD545 Week 9 · Segment 2 "Java Files and Streams: Object Writing" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 9 · Segment 2. Reading and Writing Whole Objects

## ObjectOutputStream

> Save or load entire JAVA objects with one method call, instead of breaking apart the object into its attributes. ObjectOutputStream is a **wrapper** around the FileOutputStream.

```java
BankAccount aBankAccount = new BankAccount("Rob Banks");
aBankAccount.deposit(100);
ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("myAcc.dat"));
out.writeObject(aBankAccount);
out.close();
```

## Serialization

> **Serialization** is the process of breaking down an object into bytes. The object must implement **java.io.Serializable**. This interface does not have any methods; it acts as a **"flag"** that indicates your permission for this object to be serialized.

```java
public class BankAccount implements java.io.Serializable { ... }
```

> All of the "pieces" of the object must also be serializable. If BankAccount has a `Customer owner`, then Customer must be Serializable too. Think of a meat grinder: marbles in the meat cannot come out through the grinder.

## De-Serialization

```java
try {
    ObjectInputStream in = new ObjectInputStream(new FileInputStream("myAcc.dat"));
    BankAccount aBankAccount = (BankAccount) in.readObject();
    System.out.println(aBankAccount);
    in.close();
} catch (ClassNotFoundException e) {
    System.out.println("Error: Object's class does not match");
} catch (FileNotFoundException e) {
    System.out.println("Error: Cannot open file");
} catch (IOException e) {
    System.out.println("Error: Cannot read from file");
}
```

> Once read in, the object must be **type-casted**. A **ClassNotFoundException** may be generated.

## Danger: class changes

> The saved binary format depends on the class name, attribute types and names. If you change the class definition after it has been saved, it may not be able to be read back in again.

## transient and custom serialization

> Declare any attribute as **transient** (it will not be serialized): `private transient String password;`. You can write `writeObject(ObjectOutputStream)` and `readObject(ObjectInputStream)` to override the default; `defaultWriteObject()` / `defaultReadObject()` do the default behavior.

```java
private void writeObject(ObjectOutputStream out) throws IOException {
    out.defaultWriteObject();
    out.writeObject(encrypt(password));
}

private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
    in.defaultReadObject();
    password = decrypt((String) in.readObject());
}
```

## Serialization rules

> 1. If a parent class has implemented Serializable then child class doesn't need to implement it, but vice-versa is not true.
> 2. Only non-static data members are saved.
> 3. **Static** data members and **transient** data members are **not saved**.
> 4. **Constructor of object is never called** when an object is de-serialized.
> 5. Associated objects must be implementing Serializable.

## RandomAccessFile

> All streams so far are read-only or write-only, sequential. **RandomAccessFile** allows a file to be read from and written to at random locations. The **file pointer** is where the next read or write occurs; `readInt()` moves it 4 bytes ahead.

```java
RandomAccessFile raf = new RandomAccessFile("test.dat", "rw");   // "r" = read only
for (int k = 0; k < 5; k++) raf.writeInt(k * 10);
raf.seek(8);                         // jump to byte 8 (the 3rd int)
int v = raf.readInt();               // 20
long pos = raf.getFilePointer();     // 12
long len = raf.length();             // 20
raf.close();
```
