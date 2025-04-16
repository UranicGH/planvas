package planvas.assignment.config;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.guava.GuavaModule;

/**
 * Configures how to serialize/deserialize an object to/from JSON.
 */
@Provider
public class AssignmentObjectMapperResolver implements ContextResolver<ObjectMapper> {

    private final ObjectMapper objectMapper;

    public AssignmentObjectMapperResolver() {
        objectMapper = new ObjectMapper();

        // This is here primarily to tell the object mapper how to
        // handle Google Optionals (com.google.common.base.Optional).
        objectMapper.registerModule(new GuavaModule());
    }

    @Override
    public ObjectMapper getContext(Class<?> type) {
        return objectMapper;
    }

}
