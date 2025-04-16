package planvas.assignment.assignments;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.inject.Singleton;
import com.google.inject.name.Named;

import planvas.assignment.db.HsqlLoader;

@Singleton
public class HsqlAssignmentsDao implements AssignmentsDao {

    private static final Logger LOG = LoggerFactory.getLogger(HsqlAssignmentsDao.class);

    private final String dbSchema;
    private final DataSource dataSource;

    @Inject
    HsqlAssignmentsDao(
        DataSource dataSource, 
        @Named("dbSchema") String dbSchema, 
        HsqlLoader loader
        ) {
        this.dataSource = dataSource;
        this.dbSchema = dbSchema;

        try {
            loader.initialize();
        } catch (SQLException e) {
            LOG.error("Error initializing database: {}", e.getMessage(), e);
            throw new RuntimeException("Error initializing the database.  The application will not function.", e);
        }
    }

    @Override
    public List<Assignment> getAssignments(int page, int pageSize) {
        List<Assignment> assignments = new ArrayList<>();
        String query =
                "SELECT todo.id, " +
                "       todo.date, " +
                "       todo.subject, " +
                "       todo.details " +
                "FROM " + dbSchema + ".assignments todo " +
                "WHERE todo.active = 'Y' " +
                "ORDER BY todo.date";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {

            int startIndex = (page - 1) * pageSize;
            int rowCount = 0;

            while (resultSet.next()) {
                if (rowCount >= startIndex && rowCount < startIndex + pageSize) {
                    Assignment todo = new Assignment();
                    todo.setId(resultSet.getInt("id"));
                    todo.setDate(resultSet.getDate("date"));
                    todo.setSubject(resultSet.getString("subject"));
                    todo.setDetails(resultSet.getString("details"));
                    assignments.add(todo);
                }
                rowCount++;
            }
        } catch (SQLException e) {
            LOG.error("Error querying database: {}", e.getMessage(), e);
            throw new RuntimeException("Error querying the database", e);
        }

        return assignments;
    }

    @Override
    public List<Assignment> getUpcomingAssignments() {
        List<Assignment> assignments = new ArrayList<>();
        String query = "SELECT todo.id, " +
                       "       todo.date, " +
                       "       todo.subject, " +
                       "       todo.details " +
                       "FROM " + dbSchema + ".assignments todo " +
                       "WHERE todo.active = 'Y' " +
                       "  AND todo.date BETWEEN CURRENT_TIMESTAMP AND CURRENT_TIMESTAMP + INTERVAL 1 DAY " +
                       "ORDER BY todo.date";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                Assignment todo = new Assignment();
                todo.setId(resultSet.getInt("id"));
                todo.setDate(resultSet.getDate("date"));
                todo.setSubject(resultSet.getString("subject"));
                todo.setDetails(resultSet.getString("details"));
                assignments.add(todo);
            }
        } catch (SQLException e) {
            LOG.error("Error querying database: {}", e.getMessage(), e);
            throw new RuntimeException("Error querying the database", e);
        }

        return assignments;
    }

    @Override
    public List<String> getContacts() {
        List<String> contacts = new ArrayList<>();
        String query = "SELECT DISTINCT todo.subject AS contact " +
                       "FROM " + dbSchema + ".assignments todo " +
                       "ORDER BY todo.subject ASC";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                contacts.add(resultSet.getString("contact"));
            }
        } catch (SQLException e) {
            LOG.error("Error querying database: {}", e.getMessage(), e);
            throw new RuntimeException("Error querying the database", e);
        }

        return contacts;
    }

    @Override
    public int getTotalAssignments() {
        String query = "SELECT COUNT(*) AS total " +
                       "FROM " + dbSchema + ".assignments todo " +
                       "WHERE todo.active = 'Y'";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {

            if (resultSet.next()) {
                return resultSet.getInt("total");
            }
        } catch (SQLException e) {
            LOG.error("Error querying database: {}", e.getMessage(), e);
            throw new RuntimeException("Error querying the database", e);
        }

        return 0;
    }

    @Override
    public void deleteAssignment(Integer id) {
        String query = "CALL " + dbSchema + ".deleteAssignment(?)";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {

            statement.setInt(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            LOG.error("Error deleting assignment: {}", e.getMessage(), e);
            throw new RuntimeException("Error deleting assignment", e);
        }
    }

    @Override
    public int createNewAssignment(Assignment assignment) throws SQLException {
        String query = "CALL " + dbSchema + ".addAssignment(?, ?, ?, ?)";

        try (Connection connection = dataSource.getConnection();
            CallableStatement statement = connection.prepareCall(query)) {
            statement.registerOutParameter(1, Types.INTEGER);
            statement.setDate(2, new java.sql.Date(assignment.getDate().getTime()));
            statement.setString(3, assignment.getSubject());
            statement.setString(4, assignment.getDetails().orNull());

            statement.execute();
            return statement.getInt(1); // returns the id_out parameter
        } catch (SQLException e) {
            LOG.error("Error creating assignment: {}", e.getMessage(), e);
            throw new SQLException("Error creating new assignment", e);
        }
    }
}
