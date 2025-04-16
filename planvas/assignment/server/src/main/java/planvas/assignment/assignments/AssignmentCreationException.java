package planvas.assignment.assignments;

public class AssignmentCreationException extends RuntimeException{
    public AssignmentCreationException() {
    }

    public AssignmentCreationException(String message) {
        super(message);
    }

    public AssignmentCreationException(String message, Throwable cause) {
        super(message, cause);
    }

    public AssignmentCreationException(Throwable cause) {
        super(cause);
    }

    public AssignmentCreationException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
