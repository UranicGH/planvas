package planvas.assignment.assignments;

import java.sql.SQLException;
import java.util.List;

/**
 * Interface for the assignments DAO layer.
 */
public interface AssignmentsDao {

    /**
     * Retrieve the page of assignments requested or an empty list if none exist for this page.
     * @param page the page requested
     * @param pageSize the size of each page
     * @return a List of assignments for that page based on default sort order
     */
    List<Assignment> getAssignments(int page, int pageSize);

    /**
     * Retrieve the list of assignments of the next 24 hours.
     * @return a List of assignments for that page based on default sort order
     */
    List<Assignment> getUpcomingAssignments();

    /**
     * Retrieve all unique contacts requested or an empty list if none exist for this page.
     * @return a List of unique contacts based on default sort order
     */
    List<String> getContacts();

    /**
     * @return the total active number of assignments that can be retrieved
     */
    int getTotalAssignments();

    /**
     * Delete the assignments with the passed ID.
     * @param id the ID to delete
     */
    void deleteAssignment(Integer id);

    /**
     * Create a new assignments with the passed attributes and return the assignments with the ID filled in.
     * @param assignment the assignments to create
     * @return the new ID
     */
    int createNewAssignment(Assignment assignment) throws SQLException;
}
