package planvas.assignment.assignments;

import com.google.inject.AbstractModule;

/**
 * Guice configuration for the assignment module.
 */
public class AssignmentsGuiceModule extends AbstractModule {

    @Override
    protected void configure() {
        bind(AssignmentsService.class).to(DefaultAssignmentsService.class);
        bind(AssignmentsDao.class).to(HsqlAssignmentsDao.class);
    }

}
