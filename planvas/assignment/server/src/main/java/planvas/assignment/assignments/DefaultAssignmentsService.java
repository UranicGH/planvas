package planvas.assignment.assignments;

import com.google.common.base.Strings;
import com.typesafe.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import planvas.assignment.config.TypesafeConfig;

import javax.inject.Inject;
import javax.validation.ValidationException;
import java.sql.SQLException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Default implementation for AssignmentsService.
 */
public class DefaultAssignmentsService implements AssignmentsService {

    private static final Logger LOG = LoggerFactory.getLogger(DefaultAssignmentsService.class);

    private final AssignmentsDao assignmentsDao;

    private Config config;

    @Inject
    DefaultAssignmentsService(AssignmentsDao assignmentDao, @TypesafeConfig Config config) {
        this.assignmentsDao = assignmentDao;
        this.config = config;
    }

    @Override
    public List<Assignment> getAssignments(
        int page,
        int pageSize
    ) {
        LOG.debug("Get the list of assignments.");

        return assignmentsDao.getAssignments(page, pageSize);
    }

    @Override
    public List<Assignment> getUpcomingAssignments() {
        LOG.debug("Get the list of assignments of the next 24 hours.");

        return assignmentsDao.getUpcomingAssignments();
    }

    @Override
    public List<String> getContacts() {
        LOG.debug("Get the list of contacts.");

        return assignmentsDao.getContacts();
    }

    @Override
    public int getTotalAssignments() {
        LOG.debug("Get the total number of assignments.");

        return assignmentsDao.getTotalAssignments();
    }

    @Override
    public void deleteAssignments(List<Integer> ids) {
        LOG.debug("Delete assignments: {}.", ids);

        for (Integer id : ids) {
            assignmentsDao.deleteAssignment(id);
        }
    }

    @Override
    public Assignment createNewAssignment(Assignment assignment) {
        if (!isNewAssignmentValid(assignment)) {
            throw new ValidationException("assignment was invalid");
        }
        try {
            assignment.setId(assignmentsDao.createNewAssignment(assignment));
        } catch (SQLException e) {
            LOG.error("Error adding new assignments: {}", e.getMessage());
            throw new AssignmentCreationException("Error saving assignments", e);
        }
        return assignment;
    }

    /**
     * Simple validation method for assignments.  Validates that required fields
     * are present.
     *
     * Since the client should not be sending an invalid assignment, this is just for
     * data integrity so we do not need a descriptive message if this fails.
     * @param assignment the assignment to validate
     * @return true if this assignment is valid to save; false, otherwise
     */
    private boolean isNewAssignmentValid(Assignment assignment) {

        if (assignment.getDate() == null) {
            LOG.warn("Validation failed: Assignment date is null.");
            return false;
        }

        String assignmentSubject = Strings.nullToEmpty(assignment.getSubject()).trim();

        if (Strings.isNullOrEmpty(assignmentSubject)) {
            LOG.warn("Validation failed: Assignment subject is empty or null.");
            return false;
        }

        if (assignmentSubject.length() > config.getInt("assignment.public.subjectMaxLength")) {
            LOG.warn("Validation failed: Assignment subject exceeds max length of characters.");
            return false;
        }

        if(assignmentSubject.contains("  ")) {
            LOG.warn("Validation failed: Assignment subject contains double spaces.");
            return false;
        }

        String assignmentDetails = Strings.nullToEmpty(assignment.getDetails().toString()).trim();

        if (assignmentDetails.length() > config.getInt("assignment.public.detailsMaxLength")) {
            LOG.warn("Validation failed: Assignment details exceed max length");
            return false;
        }

        String allowedPattern = "^[a-zA-Z0-9\\s.'_-]+$";
        Pattern restrictedCharsetPattern  = Pattern.compile(allowedPattern);
        Matcher matcher = restrictedCharsetPattern .matcher(assignmentSubject);

        return matcher.matches();
    }
}
