package planvas.assignment.assignments;

import java.util.List;

/**
 * Interface for the assignments service layer.
 */
public interface AssignmentsService {

    /**
     * Retrieve the page of assignments requested or an empty list if none exist for this page.
     * @param page the page requested
     * @param pageSize the size of each page
     * @return a List of assignments for that page based on default sort order
     */
    List<Assignment> getAssignments(int page, int pageSize);

    /**
     * Retrieve the list of assignments upcoming in the next 24 hours if none exist for this page.
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
     * Delete the assignments with the passed IDs.
     * @param ids the IDs to delete
     */
    void deleteAssignments(List<Integer> ids);
    /**
     * Create a new assignment with the passed attributes and return the assignments with the ID filled in.
     * @param assignment the assignments to create
     * @return the updated assignments with ID set
     */
    Assignment createNewAssignment(Assignment assignment);
}
