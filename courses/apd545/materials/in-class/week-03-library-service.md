Source: <APD545 Week 3 교수님 샘플 코드 WK_3_DS_Lib_Service 발췌 (구조와 핵심 메서드만)>
# Week 3 · Sample: WK_3_DS_Lib_Service

## Project Structure

```
ca.senecacollege
  models/       Book, User, BookIssueRecord, Library
  services/     BookService, UserService, IssuanceService, LibraryService
  controllers/  LibraryController
  views/        MainView
```

## Example: BookService (HashMap by ISBN)

```java
public class BookService {
    private Map<String, Book> books;

    public BookService() { books = new HashMap<>(); }

    public void addBook(Book book)     { books.put(book.getIsbn(), book); }
    public Book getBook(String isbn)   { return books.get(isbn); }
    public void removeBook(String isbn){ books.remove(isbn); }

    public void displayBooks() {
        for (Book book : books.values()) System.out.println(book);
    }
}
```

## Example: IssuanceService (LinkedHashMap + entrySet)

```java
public class IssuanceService {
    private Map<String, BookIssueRecord> issuedBooks = new LinkedHashMap<>();

    public void issueBook(String isbn, String userId, BookIssueRecord record) {
        issuedBooks.put(isbn, record);
    }

    public BookIssueRecord returnBook(String isbn) {
        return issuedBooks.remove(isbn);    // returns the removed value, or null
    }

    public void displayIssuedBooks() {
        for (Map.Entry<String, BookIssueRecord> entry : issuedBooks.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue().getUserId());
        }
    }
}
```

## Example: LibraryController.issueBook

```java
public void issueBook(String isbn, String userId) {
    if (bookService.getBook(isbn) != null &&
        userService.getUser(userId) != null &&
        issuanceService.getIssuedBooks().get(isbn) == null) {

        issuanceService.issueBook(isbn, userId, new BookIssueRecord(userId, new Date(), null));
        bookService.removeBook(isbn);
        System.out.println("Book issued");
    } else {
        System.out.println("Book can't be issued");
    }
}
```
