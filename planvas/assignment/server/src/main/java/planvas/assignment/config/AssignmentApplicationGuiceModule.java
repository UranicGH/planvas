package planvas.assignment.config;

import javax.sql.DataSource;

import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.google.inject.name.Named;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import org.hsqldb.jdbc.JDBCDataSource;

import planvas.assignment.assignments.AssignmentsGuiceModule;

/**
 * Guice configuration for the assignment application.
 */
public class AssignmentApplicationGuiceModule extends AbstractModule {

    // Register Guice modules for dependency injection.
    @Override
    protected void configure() {
        install(new AssignmentsGuiceModule());
    }

    // Load Typesafe config and provide it for dependency injection.
    @Provides
    @TypesafeConfig
    private Config provideConfig() {
        return ConfigFactory.load();
    }

    // Create and provide the data source, e.g., database.
    @Provides
    @Singleton
    private DataSource provideDataSource(@TypesafeConfig Config config) {
        JDBCDataSource dataSource = new JDBCDataSource();

        dataSource.setDatabase(config.getString("assignment.private.database.dsConnectionString"));
        dataSource.setUser(config.getString("assignment.private.database.dsName"));
        dataSource.setPassword(config.getString("assignment.private.database.dsPassword"));

        return dataSource;
    }

    // Provide the database schema.
    @Provides
    @Singleton
    @Named("dbSchema")
    private String provideDbSchema(@TypesafeConfig Config config) {
        return config.getString("assignment.private.database.dbSchema");
    }

}
