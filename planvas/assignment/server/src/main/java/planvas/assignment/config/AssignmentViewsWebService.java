package planvas.assignment.config;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.typesafe.config.Config;
import com.typesafe.config.ConfigRenderOptions;

import org.glassfish.jersey.server.mvc.Viewable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Maps urls to JSPs.
 */
@Path("/views")
@Produces(MediaType.TEXT_HTML)
public class AssignmentViewsWebService {

  private static final Logger LOG = LoggerFactory.getLogger(AssignmentViewsWebService.class);

  private final Config config;

  @Inject
  protected AssignmentViewsWebService(
    @TypesafeConfig Config config
  ) {
    this.config = config;
  }

  @GET
  public Viewable root() {
    LOG.debug("Get root view.");

    // Create a string of the configs to page to the client.
    String typesafeConfig = config
        // Include only the public configs.  It's important not to allow
        // private configs to be viewable from the client.
        .withOnlyPath("assignment.public")
        // Gets the config object for the corresponding config.  This is
        // a tree of keys and config values that resembles a JSON structure:
        // {
        //   "user": {
        //     "name": "Tom",
        //     "id": 1234
        //   }
        // }
        // instead of a flat map of full paths to config values:
        // {
        //   "user.name": "Tom",
        //   "user.id": 1234
        // }
        .root()
        // Renders the config to JSON without whitespace or comments.
        .render(ConfigRenderOptions.concise());

    Map<String, String> model = new HashMap<>();
    // This will pass the Typesafe config JSON string to the client
    // as <i>model.typesafeConfig</i>
    model.put("typesafeConfig", typesafeConfig);

    // Use the JSP named "root" (the ".jsp" is implied) and pass it
    // the model.
    return new Viewable("/root", model);
  }

}
