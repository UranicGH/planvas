package planvas.assignment.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;

import javax.inject.Inject;
import javax.sql.DataSource;

import com.google.inject.name.Named;
import org.joda.time.Instant;

public class HsqlLoader {
    private final DataSource dataSource;
    private final String dbSchema;

    @Inject
    HsqlLoader(
        DataSource dataSource,
        @Named("dbSchema") String dbSchema
    ) {
        this.dataSource = dataSource;
        this.dbSchema = dbSchema;
    }

    public void initialize() throws SQLException {
        try (Connection connection = dataSource.getConnection()){

            String createTableQuery =
                "CREATE TABLE IF NOT EXISTS "+dbSchema+".ASSIGNMENTS (" +
                "id INTEGER IDENTITY, " +
                "date TIMESTAMP, " +
                "subject VARCHAR(30), " +
                "details VARCHAR(100), " +
                "active VARCHAR(1) DEFAULT 'Y'"+
                ")";

            connection.createStatement().executeUpdate(createTableQuery);   

            Instant current = Instant.now();

            for (int i = 0; i < 10; i++) {
                current = current.plus(1000*60*60); //1 hr
                addEntry(connection, current.toDate(), "Subject " + i, "Details " + i);
            }

            //create procedures
            String storedProcAddAsmnt = 
                "CREATE PROCEDURE "+dbSchema+".addAssignment(" +
                "  OUT id INT," +
                "  IN newDate TIMESTAMP," +
                "  IN subject VARCHAR(30)," +
                "  IN details VARCHAR(100)" +
                ")" + 
                "  MODIFIES SQL DATA" +
                "  BEGIN ATOMIC" +
                "    INSERT INTO "+dbSchema+".ASSIGNMENTS(date, subject, details)" +
                "                                  VALUES(newDate, subject, details);" +
                "    SET id = IDENTITY();"+
                "  END";
            
            connection.createStatement().executeUpdate(storedProcAddAsmnt);

            String storedProcDeleteAsmnt =
                "CREATE PROCEDURE "+dbSchema+".deleteAssignment(" +
                "  IN delId INT" +
                ")" +
                "  MODIFIES SQL DATA" +
                "  BEGIN ATOMIC" +
                "    UPDATE "+dbSchema+".ASSIGNMENTS asmnt" +
                "       SET asmnt.active = 'N'" +
                "     WHERE asmnt.id = delId;" +
                "  END";
            
            connection.createStatement().executeUpdate(storedProcDeleteAsmnt);
        }
    }
    void addEntry(Connection connection, Date date, String subject, String details) throws SQLException {
        String query = 
            "INSERT INTO "+dbSchema+".ASSIGNMENTS (date, subject, details)" +
                                    "      VALUES (?, ?, ?)";

        try (PreparedStatement statement = connection.prepareStatement(query)) {
            statement.setDate(1, new java.sql.Date(date.getTime()));
            statement.setString(2, subject);
            statement.setString(3, details);

            statement.executeUpdate();
        }
    }

}
