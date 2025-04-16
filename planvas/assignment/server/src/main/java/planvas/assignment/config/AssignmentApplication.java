package planvas.assignment.config;

import javax.inject.Inject;
import javax.servlet.ServletContext;

import com.google.inject.Guice;
import org.glassfish.hk2.api.ServiceLocator;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.mvc.jsp.JspMvcFeature;
import org.jvnet.hk2.guice.bridge.api.GuiceBridge;
import org.jvnet.hk2.guice.bridge.api.GuiceIntoHK2Bridge;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Jersey configuration for assignment application.
 */
public class AssignmentApplication extends ResourceConfig {

    private static final Logger LOG = LoggerFactory.getLogger(AssignmentApplication.class);

    private static final String PACKAGES = "planvas.assignment";

    @Inject
    public AssignmentApplication(ServiceLocator serviceLocator, ServletContext servletContext) {
        // Tell Jersey where to scan for web services.
        LOG.debug(String.format("Set package for Jersey to scan: [%s].", PACKAGES));
        packages(PACKAGES);

        // Tell Jersey the location of JSPs to use for the views of Viewables.
        LOG.debug("Register JspMvcFeature.");
        property(JspMvcFeature.TEMPLATE_BASE_PATH, "/WEB-INF/jsp");
        register(JspMvcFeature.class);

        // Tell Jackson how to serialize/deseriablize Java objects to/from JSON.
        LOG.debug("Register object mapper.");
        register(AssignmentObjectMapperResolver.class);

        // See https://javaee.github.io/hk2/guice-bridge.
        LOG.debug("Initialize the Guice bridge.");
        GuiceBridge.getGuiceBridge().initializeGuiceBridge(serviceLocator);
        GuiceIntoHK2Bridge guiceBridge = serviceLocator.getService(GuiceIntoHK2Bridge.class);
        guiceBridge.bridgeGuiceInjector(Guice.createInjector(new AssignmentApplicationGuiceModule()));
    }

}
