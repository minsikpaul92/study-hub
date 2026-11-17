# Week 9. 파일 입출력: Stream, Text, Object, RandomAccessFile

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. ⌨️ 표시가 있는 코드는 IntelliJ에서 직접 쳐 보세요(JavaFX 없이 `main`만으로 돼요).
>
> 프로그램을 꺼도 데이터가 남게 하는 방법이에요. Week 6 FileChooser로 고른 파일에 실제로 쓰고 읽는 부분, Week 8 JDBC의 try-with-resources, Week 13 소켓 스트림과 이어져요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 시험에 나오는 모양 |
| --- | --- | --- |
| Stream 4대 뿌리 | InputStream, OutputStream(바이트) / Reader, Writer(문자) | 공통 부모 Stream 클래스는 **없음** |
| 표준 스트림 | `System.in`, `System.out`, `System.err` | in은 BufferedInputStream, out은 PrintStream |
| FileOutputStream | 바이트 쓰기. `(name, true)`면 **이어쓰기** | 기본은 덮어쓰기 |
| DataOutput/InputStream | 기본형, `writeUTF` 통째로. **쓴 순서대로 읽기** | 바이너리 |
| PrintWriter / BufferedReader | 텍스트 줄 쓰기 / `readLine()` | 객체는 `toString()`으로 저장 |
| Buffered 스트림 | 블록 단위(기본 8192바이트), **다른 스트림에 감싸서**(chain) | `flush()` |
| try-with-resources | `AutoCloseable`이면 자동 `close()` | 여러 개 `;`로 |
| Byte vs Character | 8비트 raw vs 16비트 char, Unicode 처리 | 바이너리가 더 효율적 |
| Serialization | `implements Serializable`(marker), `writeObject`/`readObject` | 캐스팅, ClassNotFoundException |
| 저장 안 됨 | **static**, **transient** 필드 | 역직렬화 때 생성자 **안 불림** |
| RandomAccessFile | `"r"`/`"rw"`, `seek(pos)`, `getFilePointer()` | readInt 후 포인터 +4 |

**함정 모음**

- `new FileOutputStream("a.dat")`는 기존 내용을 **지운다**. 이어 쓰려면 두 번째 인자 `true`.
- `close()`(또는 `flush()`)를 안 하면 버퍼에 남은 데이터가 **파일에 안 써질 수** 있다.
- 파일 열기는 `FileNotFoundException`, 읽기/쓰기는 `IOException`. 앞의 것이 뒤의 것의 **자식**이라 catch 순서는 FileNotFound가 먼저.
- `readObject()`는 `Object`를 반환 → **캐스팅** 필요, 그리고 `ClassNotFoundException`도 처리.
- 객체 안의 다른 객체 필드도 **전부 Serializable**이어야 한다. 아니면 `NotSerializableException`.
- 슬라이드에 "역직렬화하려면 인자 없는 생성자가 있어야 한다"는 문장이 있는데, 아래 해설처럼 **Serializable 클래스 자신은 필요 없다**(직접 돌려서 확인).

{{PRACTICE}}

{{TOC}}

@@SLIDE week-09-1-io-basic.md
@@S _doc | read
파일에 **바이트**로, **글자**로 쓰고 읽는 법과, 스트림을 감싸서(chain) 기능을 더하는 Java IO의 구조를 봐요.
@@S Writing binary data: FileOutputStream | type
할 일: myFile.dat에 HELLO!를 바이트로 쓰고, FileInputStream으로 읽어 숫자 72 69 76 76 79 33이 나오는지 확인
@@S Writing text: PrintWriter | type
할 일: PrintWriter로 이름, 계좌번호, 잔액을 세 줄로 저장하고 BufferedReader로 다시 읽어 출력
@@S try-with-resources (Java 7) | type
할 일: 파일 복사 프로그램을 try-with-resources로 쓰기 (입력, 출력 스트림 두 개)
@@K Outcomes
목표: IO 클래스 구조 보기, 스트림 만들고 쓰기, **Byte / Character / Buffered** 스트림 차이, 파일 IO 프로그램 작성.
@@K Files and Streams
파일은 전원이 꺼져도 남는 저장소예요. 규칙: **열고 → 읽기/쓰기 → 반드시 닫기**. 파일의 내용은 결국 0~255 숫자(바이트)의 나열이고, Java에서는 이걸 **Stream**(흐름) 객체로 다뤄요. 넣은 순서 그대로 나와요(수도관처럼).
@@K Streams
스트림은 파일만이 아니라 **네트워크, 다른 프로그램, 키보드/콘솔**에도 똑같이 써요. 그래서 Week 13 소켓도 `getInputStream()`으로 같은 방식이에요.

4대 뿌리(추상 클래스):

| | 읽기 | 쓰기 |
| --- | --- | --- |
| 바이트(binary) | `InputStream` | `OutputStream` |
| 문자(text) | `Reader` | `Writer` |

이름 끝을 보면 종류를 알 수 있어요: `...Stream`은 바이트, `...Reader/Writer`는 문자.
@@K Buffers
디스크 접근은 메모리 작업보다 **엄청 느려요**. 그래서 버퍼(임시 바구니)에 모았다가 한 번에 보내요. 택배를 하나씩 보내지 않고 상자에 모아 보내는 것. `flush()` = 상자가 안 찼어도 지금 보내기.

`System.out`이 `PrintStream`이라는 것도 기억: 우리가 매일 쓰는 `println`이 사실 스트림이에요.
@@K Writing binary data: FileOutputStream
`write(int)`는 **한 바이트**(0~255)를 써요. `'H'`(문자)도 숫자 72라서 들어가요. 그래서 파일에는 `HELLO!`가 들어가요(69=E, 76=L).

예외 두 개: 파일을 못 열면 `FileNotFoundException`, 쓰다가 문제면 `IOException`. FileNotFound가 IOException의 **자식**이라 catch는 **자식 먼저** 써야 해요(반대면 컴파일 에러: unreachable).

윈도우 경로의 `\`는 문자열에서 특수문자라 `\\` 두 번. 맥/리눅스는 `/`.
@@K DataOutputStream
int 7293901을 바이트 하나씩 쪼개 쓰는 건 고생이죠. `DataOutputStream`이 FileOutputStream을 **감싸서** `writeInt`, `writeDouble`, `writeUTF`를 제공해요. 이게 **데코레이터**(wrapper) 패턴이에요(Week 12와 연결).

읽을 때는 `DataInputStream`으로 **쓴 순서 그대로** `readInt`, `readUTF`, `readDouble`. 순서가 틀리면 엉뚱한 값이 나와요. 예: `writeInt(7)`, `writeUTF("Hi")`, `writeDouble(1.5)` → 파일 크기 16바이트(int 4 + UTF 길이 2 + 글자 2 + double 8). (직접 돌려 확인했어요.)
@@K Reading binary data: FileInputStream
`read()`는 한 바이트를 int로 돌려주고, 파일 끝이면 **-1**. `available()`은 남은 바이트 수. 출력: `72 69 76 76 79 33`.

보통은 `while ((b = in.read()) != -1)` 패턴도 많이 써요.
@@K Writing text: PrintWriter
`PrintWriter`는 파일용 `System.out`이에요. `println(객체)`를 하면 그 객체의 **`toString()`** 결과가 저장돼요.

`new PrintWriter(new FileWriter("x.dat"))`: FileWriter(문자 단위 파일 쓰기)를 PrintWriter(println 기능)로 감쌈. 텍스트 파일이라 메모장으로 열면 사람이 읽을 수 있어요(바이너리와 차이).
@@K Reading text: BufferedReader and Scanner
텍스트로 저장한 건 **문자열**로만 돌아와요. 숫자는 `Integer.parseInt`, `Float.parseFloat`로 다시 바꾸고, 객체는 생성자로 **다시 조립**해야 해요.

`Scanner`를 쓰면 `nextInt()`, `nextFloat()`로 바로 숫자. 주의: `nextInt()` 뒤에 `nextLine()`을 부르면 남은 줄바꿈만 읽어서 빈 문자열이 나오는 유명한 함정이 있어요.
@@K Buffering and Chained Streams
`read()` 한 번 = OS 호출 한 번이라 느려요. Buffered 스트림은 **8192바이트**씩 미리 읽어 두고 메모리에서 꺼내 줘요.

**Chained streams**: Buffered는 버퍼링만 하고 파일은 몰라요. 그래서 파일 스트림을 **감싸서** 써요.

```
new DataInputStream( new BufferedInputStream( new FileInputStream("a.dat") ) )
   기본형 읽기             버퍼링                 실제 파일
```
@@K Stream IO Operations
모든 IO의 3단계: **열기 → 읽기/쓰기 → 닫기**. 닫기를 잊으면 파일이 잠기거나(OS 파일 핸들), 쓰기 내용이 버퍼에 남아 사라질 수 있어요.
@@K Standard Template
Java 7 이전 방식: `finally`에서 닫기. 중간에 예외가 나도 `finally`는 항상 실행되니까요. `in`이 null일 수 있어서(열기부터 실패) `if (in != null)` 검사, `close()`도 예외를 던질 수 있어서 try-catch가 또 필요해요. 복잡하죠. 그래서 다음 문법이 나왔어요.

참고: 원래 슬라이드는 `if(n != null)`로 오타가 있어요. `in`이 맞아요.
@@K try-with-resources (Java 7)
`try ( 자원 선언 ) { ... }`: 블록이 끝나면(예외가 나도) **자동으로 `close()`**. 조건: 자원이 **`AutoCloseable`**을 구현해야 해요(Week 2의 "Common Interfaces"). 여러 개는 `;`로 구분하고, **선언 반대 순서**로 닫혀요.

Week 8 JDBC의 `Connection`, `PreparedStatement`, `ResultSet`도 이렇게 닫았죠.
@@K Byte Stream vs Character Stream
- Byte: 1바이트씩, 그림, 소리, `.dat` 같은 **raw 데이터**. 글자로 바꾸는 건 내 책임.
- Character: Java `char`(2바이트)씩, **Unicode(한글 등)**를 알아서 인코딩.

어느 게 더 효율적? **바이너리**(인코딩, 디코딩 과정이 없어서). 시험 단골 질문이에요.

@@SLIDE week-09-2-object-io.md
@@S _doc | read
객체를 필드별로 쪼개지 않고 **통째로** 저장하는 **직렬화(Serialization)**와, 파일 중간을 바로 읽고 쓰는 **RandomAccessFile**이에요.
@@S De-Serialization | type
할 일: BankAccount를 Serializable로 만들어 writeObject로 저장하고 readObject로 다시 읽기 (transient 필드가 null로 돌아오는지도 확인)
@@S RandomAccessFile | type
할 일: int 5개를 쓰고 seek(8)로 세 번째 int를 읽어 20, 포인터 12, 길이 20인지 확인
@@K ObjectOutputStream
`writeObject(obj)` 한 줄로 객체 저장. 역시 FileOutputStream을 **감싸는** 구조예요(객체 → 바이트는 ObjectOutputStream, 바이트 → 파일은 FileOutputStream).
@@K Serialization
**직렬화** = 객체를 바이트 줄로 펼치기. 조건: `implements Serializable`.

`Serializable`은 메서드가 **하나도 없는 marker interface**예요(Week 4 EventListener와 같은 종류). "직렬화해도 된다"는 **허락 표시**예요. 보안상 아무 객체나 파일이나 네트워크로 나가지 못하게 막는 거죠.

**고기 분쇄기 비유**: 객체 안에 Serializable이 아닌 필드 객체(구슬)가 있으면 갈 수 없어요 → `NotSerializableException`. 그래서 `Customer owner`가 있으면 Customer도 Serializable이어야 해요. `String`, `ArrayList` 같은 표준 클래스는 대부분 이미 Serializable.
@@K De-Serialization
읽기: `(BankAccount) in.readObject()`. 반환형이 `Object`라 **캐스팅**, 그리고 저장된 클래스를 찾지 못하면 **`ClassNotFoundException`**(checked라 꼭 처리).

슬라이드에는 "역직렬화하려면 객체에 **인자 없는 생성자**가 있어야 하고 없으면 IOException"이라는 문장이 있어요. 하지만 같은 강의 뒤쪽 규칙 4번("Constructor of object is never called")과 맞지 않고, 실제로 인자 없는 생성자가 **없는** Serializable 클래스도 잘 읽혀요(직접 돌려서 확인, 생성자 출력도 저장할 때 한 번만 찍혀요). 정확한 규칙은: **Serializable이 아닌 첫 번째 부모 클래스**에 인자 없는 생성자가 있어야 한다(보통 `Object`라서 신경 쓸 일이 없음). 시험에서 이 문장이 나오면 슬라이드 표현과 실제 규칙이 다르다는 것만 기억해 두세요.
@@K Danger: class changes
저장된 바이트에는 클래스 이름, 필드 이름과 타입이 들어 있어요. 저장 후 클래스를 고치면(필드 타입 변경, 삭제 등) 옛 파일을 못 읽을 수 있어요(`InvalidClassException`). 그래서 실무에서는 `private static final long serialVersionUID = 1L;`을 직접 적어 버전을 관리해요.
@@K transient and custom serialization
`transient` = "이 필드는 저장하지 마". 비밀번호, 캐시, 소켓처럼 저장하면 안 되거나 못 하는 것. 읽어 오면 **기본값**(객체는 null, 숫자는 0)이에요.

직접 제어하고 싶으면 클래스 안에 `private void writeObject(ObjectOutputStream)`, `private void readObject(ObjectInputStream)`를 만들어요. Java가 **알아서 불러 줘요**(우리가 부르지 않음, Week 7 IoC의 callback). 안에서 `defaultWriteObject()`로 기본 저장을 먼저 하고, 암호화한 값을 추가로 써요. 슬라이드는 `public`으로 썼지만 Java 규칙상 **private**이어야 이렇게 자동 호출돼요.
@@K Serialization rules
다섯 개 규칙(시험용):

1. 부모가 Serializable이면 자식도 자동으로 Serializable. 반대는 아님.
2~3. **static**(클래스 공용 값)과 **transient**는 저장 안 됨. 예: 저장 후 static 값을 9로 바꾸고 읽으면 9가 보여요(파일에서 온 게 아니니까).
4. 역직렬화 때 생성자 **안 불림**. 필드는 파일에서 바로 채워져요.
5. 안에 들어 있는 객체도 Serializable이어야 함.

내가 돌린 예: `owner="Rob"`, `balance=100`, `transient pw="secret"`, `static count` → 읽은 결과 `Rob 100.0 null 9`.
@@K RandomAccessFile
지금까지 스트림은 **처음부터 순서대로**(sequential)만. 중간 하나를 고치려면 파일을 새로 써야 했어요. RandomAccessFile은 **파일 포인터**를 원하는 위치로 옮겨(`seek`) 바로 읽고 써요. 동영상 탐색 바처럼요.

- 모드: `"r"` 읽기 전용, `"rw"` 읽기+쓰기
- `writeInt` 5번 → 20바이트. `seek(8)` → 세 번째 int(0, 10, **20**) 위치. `readInt()` 후 포인터는 **12**.
- 고정 크기 레코드(예: int 하나 = 4바이트)라면 n번째 레코드 위치 = `n * 레코드크기`. 그래서 바로 점프할 수 있어요.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 9

완료된 주문을 저장해요. `Order`와 `OrderLine`을 `Serializable`로 만들고, File > Save Orders(FileChooser `showSaveDialog`)로 `ObjectOutputStream`에 `List<Order>`를 통째로 저장, Open으로 다시 불러와 목록에 표시. 영수증은 `PrintWriter`로 사람이 읽을 수 있는 `.txt`로 내보내기. 모든 스트림은 try-with-resources. (토이 가이드는 준비 중이에요.)

## ✅ 시험 대비 체크리스트 (Week 9)

- [ ] 4대 스트림 뿌리(InputStream, OutputStream, Reader, Writer)와 바이트/문자 구분을 안다.
- [ ] `System.in/out/err`의 역할과 클래스(BufferedInputStream, PrintStream)를 안다.
- [ ] FileOutputStream의 덮어쓰기와 append 생성자를 구분한다.
- [ ] FileNotFoundException, IOException의 발생 시점과 catch 순서를 안다.
- [ ] DataOutputStream/DataInputStream으로 기본형을 쓰고 같은 순서로 읽을 수 있다.
- [ ] PrintWriter로 쓰고 BufferedReader(readLine)나 Scanner로 읽을 수 있다.
- [ ] 버퍼링의 이유(8192바이트), flush, chained stream 구조를 설명할 수 있다.
- [ ] finally로 닫는 옛 방식과 try-with-resources(AutoCloseable)를 쓸 수 있다.
- [ ] Byte vs Character 스트림 차이와 어느 쪽이 더 효율적인지 안다.
- [ ] Serializable(marker), writeObject, readObject + 캐스팅, ClassNotFoundException을 쓸 수 있다.
- [ ] static과 transient가 저장되지 않고, 역직렬화 때 생성자가 불리지 않음을 안다.
- [ ] RandomAccessFile의 모드, seek, getFilePointer, length를 쓸 수 있다.

## ✍️ 손으로 써 보기

1. `scores.txt`에 이름과 점수를 한 줄에 하나씩(`Mike,90`) 쓰는 메서드와, 다시 읽어 평균을 출력하는 메서드를 try-with-resources로 쓰세요.

<details><summary>1번 예시 답</summary>

```java
static void save(Map<String, Integer> scores) throws IOException {
    try (PrintWriter out = new PrintWriter(new FileWriter("scores.txt"))) {
        for (Map.Entry<String, Integer> e : scores.entrySet())
            out.println(e.getKey() + "," + e.getValue());
    }
}

static void printAverage() throws IOException {
    try (BufferedReader in = new BufferedReader(new FileReader("scores.txt"))) {
        String line;
        int sum = 0, count = 0;
        while ((line = in.readLine()) != null) {
            String[] parts = line.split(",");
            sum += Integer.parseInt(parts[1].trim());
            count++;
        }
        System.out.println(count == 0 ? 0 : (double) sum / count);
    }
}
```

</details>

2. 다음 클래스를 저장하고 읽었을 때 출력은?

```java
class User implements Serializable {
    String name = "Ann";
    transient int age = 20;
    static String school = "Seneca";
}
// User 저장 → User.school = "York"; → 읽어서
System.out.println(u.name + " " + u.age + " " + User.school);
```

<details><summary>2번 정답</summary>

`Ann 0 York`. transient는 저장 안 돼서 int 기본값 0, static은 파일과 상관없이 지금 클래스의 값.

</details>

3. 아래 코드는 컴파일 에러가 나요. 이유는?

```java
try {
    FileInputStream in = new FileInputStream("a.dat");
} catch (IOException e) {
    System.out.println("IO");
} catch (FileNotFoundException e) {
    System.out.println("not found");
}
```

<details><summary>3번 정답</summary>

`FileNotFoundException`은 `IOException`의 자식이라 첫 번째 catch가 이미 다 잡아요. 두 번째 catch에 도달할 수 없어서(unreachable) 컴파일 에러예요. 자식 예외(FileNotFoundException)를 먼저 써야 해요.

</details>
