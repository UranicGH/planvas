package planvas.assignment.assignments;

import java.util.List;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Jersey REST interface for interacting with assignments objects.
 */
@Path("assignments")
public class AssignmentsWeb {

    private static final Logger LOG = LoggerFactory.getLogger(AssignmentsWeb.class);

    private final AssignmentsService assignmentsService;

    @Inject
    public AssignmentsWeb(AssignmentsService assignmentService) {
        this.assignmentsService = assignmentService;
    }

    /**
     * GET /assignments to get a page of assignments.  Requires <i>page</i> and <i>pageSize</i>
     * query parameters.
     * @param page the 1-based page number to retrieve
     * @param pageSize the number of results on a page
     * @return a list of the page of results
     */
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Assignment> getAssignments(
        @QueryParam("page") int page,
        @QueryParam("pageSize") int pageSize
    ) {
        LOG.debug("Get the list of assignments.");

        return assignmentsService.getAssignments(page, pageSize);
    }

    /**
     * GET /assignments/upcoming to get list of unique contacts.
     * @return a list of upcoming assignments for the next 24 hours.
     */
    @GET
    @Path("upcoming")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Assignment> getUpcomingAssignments() {
        LOG.debug("Get the list of upcoming assignments for the next 24 hours.");

        return assignmentsService.getUpcomingAssignments();
    }

    /**
     * GET /assignments/contacts to get list of unique contacts.
     * @return a list of the unique contacts from all assignments
     */
    @GET
    @Path("contacts")
    @Produces(MediaType.APPLICATION_JSON)
    public List<String> getContacts() {
        LOG.debug("Get the list of contacts.");

        return assignmentsService.getContacts();
    }

    /**
     * GET /assignments/total to get the total nuber of assignments.
     * @return the total number of assignments
     */
    @GET
    @Path("total")
    @Produces(MediaType.APPLICATION_JSON)
    public AssignmentTotal getTotalAssignments() {
        LOG.debug("Get the total number of assignments.");

        return new AssignmentTotal(assignmentsService.getTotalAssignments());
    }

    /**
     * DELETE /assignments to delete the specified assignments.  Should be
     * a query parameter list of assignments IDs.  A query parameter list
     * looks like multiples of the same parameter with different values,
     * e.g., /assignments?ids=101&ids=102&ids=103.
     * @param ids
     */
    @DELETE
    public void delete(@QueryParam("ids") List<Integer> ids) {
        LOG.debug("Delete assignments: {}.", ids);

        assignmentsService.deleteAssignments(ids);
    }
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Assignment saveNewAssignment(Assignment assignment) {
        return assignmentsService.createNewAssignment(assignment);
    }

}
