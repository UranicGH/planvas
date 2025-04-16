import { Injectable } from '@angular/core';
// Changing lodash.get() to _get in order to avoid confusion
// with the class method of the same name.
import { get as _get } from 'lodash';
import { Config } from 'src/app/domain/config';

/**
 * Declaring a variable (or function, etc) tells TypeScript that
 * a variable matching this exists on "window" or "globalThis"
 * without needing to know how it was created.  In this case,
 * "planvas" was created in config.jsp.  If config.jsp was included
 * correctly, "planvas" should already exist.
 */
declare const planvas: {
  assignment: {
    config: Config;
  };
};

/**
 * This service reads the config values that were set to
 * "window" or "globalThis" by config.jsp.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  /**
   * This gets a config value at a specified path.
   *
   * Note: the use of generics here enables implied (or explicit)
   * typecasting.  Since a "Config" can be a string, number,
   * Config, etc, it can be cast to a specific type.
   *
   * Example of implicit generics:
   * const maxCharacters: number = configService.get('maxCharacters');
   *
   * This is equivalent to:
   * const maxCharacters = configService.get<number>('maxCharacters');
   * or
   * const maxCharacters = configService.get('maxCharacters') as number;
   * @param path the dot-notation page of the config property
   * @returns the value of the config property
   */
  get<T extends Config> (path: string): T {
    return _get(planvas.assignment.config, path) as T;
  }

}
