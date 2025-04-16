import { Config } from 'src/app/domain/config';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  const config: Config = {
    test: 'something'
  };

  let service: ConfigService;

  beforeEach(() => {
    globalThis.planvas = {
      assignment: {
        config: config
      }
    };

    service = new ConfigService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {

    it('should return the config specified by the dot-notated path', () => {
      const actual: string = service.get('test');

      expect(actual).toEqual(config.test as string);
    });

  });
});
