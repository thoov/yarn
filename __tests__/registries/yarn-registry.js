/* @flow */
import {YARN_REGISTRY} from '../../src/constants.js';
import YarnRegistry from '../../src/registries/yarn-registry.js';

function createMocks(): Object {
  const mockRequestManager = {
    request: jest.fn(),
  };
  const mockRegistries = {
    npm: {
      getOption(key): mixed {
        return this.config[key];
      },
    },
    yarn: {},
  };

  return {
    mockRequestManager,
    mockRegistries,
  };
}

describe('getOption', () => {
  test('correctly fallsback to npm config', () => {
    const {mockRequestManager, mockRegistries, mockReporter} = createMocks();
    const yarnRegistry = new YarnRegistry('.', mockRegistries, mockRequestManager, mockReporter);

    yarnRegistry.config = {
      registry: YARN_REGISTRY,
      nonDefault: 'yarn',
    };

    mockRegistries.npm.config = {
      registry: 'npm.registry',
      nonDefault: 'npm',
      onlyOnNpm: 'npm',
    };

    expect(yarnRegistry.getOption('registry')).toEqual('npm.registry');
    expect(yarnRegistry.getOption('nonDefault')).toEqual('yarn');
    expect(yarnRegistry.getOption('onlyOnNpm')).toEqual('npm');

    yarnRegistry.config.registry = 'yarn.registry';

    expect(yarnRegistry.getOption('registry')).toEqual('yarn.registry');
  });
});
