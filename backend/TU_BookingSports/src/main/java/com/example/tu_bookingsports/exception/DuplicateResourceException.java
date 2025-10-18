//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\exception\DuplicateResourceException.java
package com.example.tu_bookingsports.exception;
public class DuplicateResourceException extends RuntimeException {

    // Default constructor
    public DuplicateResourceException() {
        super();
    }

    // Custom message constructor (used in AuthService)
    public DuplicateResourceException(String message) {
        super(message);
    }
}
