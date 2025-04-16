package planvas.assignment.config;

import java.lang.annotation.Target;
import java.lang.annotation.Retention;

import javax.inject.Qualifier;

import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

/**
 * For injection binding.
 */
@Qualifier
@Target({ FIELD, PARAMETER, METHOD })
@Retention(RUNTIME)
public @interface TypesafeConfig {}