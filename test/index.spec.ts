import { Logger } from '../src';

const SCOPE_NAME = 'spec';

let logger: Logger;

function assertLogTrail(expectedLogTrail: string[]) {
  const logTrail = logger.getLogTrail();
  expect(logTrail.length).toEqual(expectedLogTrail.length);

  logTrail.forEach((logMessage, index) => {
    const contentIncluded = logMessage[0].includes(expectedLogTrail[index])
    expect(contentIncluded).toBeTrue();
  })


}

function assertMessages(content: string, _logger: Logger = logger) {
  const logTrail = _logger.getLogTrail();
  const hasContent = logTrail.some(logMessage => {
    const contentIncluded = logMessage.some(message => message.includes(content))
    return contentIncluded;
  })
  expect(hasContent).toBeTrue();
}

function assertMessagesMany(content: string[], _logger: Logger = logger) {
  const logTrail = _logger.getLogTrail();

  expect(logTrail.length).toEqual(content.length);

  logTrail.forEach((logMessage, index) => {
    const contentIncluded = logMessage[0].includes(content[index])
    expect(contentIncluded).toBeTrue();
  })
}

describe('Logger - Options', () => {
  beforeEach(() => {
    logger = new Logger({scope: SCOPE_NAME});
  })

  describe('disableLogger', () => {
    it('disableLogger - false', () => {
      logger.setLogOptions({disableLogger:false});

      logger.debug(['foo']);

      assertMessages('foo');
    });
    it('disableLogger - true', () => {
      logger.setLogOptions({disableLogger:true});

      logger.debug(['foo']);

      assertLogTrail([]);
    });
  });

  it('scope', () => {
    logger.debug(['']);

    const formatedScopeName = `[${SCOPE_NAME}]`;

    assertMessages(formatedScopeName);
  });

  it('deepLogObjects', () => {
    logger.debug(['foo %o', {bar:'baz'}], {deepLogObjects:true});

    assertMessages('foo');
    assertMessages('{"bar":"baz"}');
  });

  describe('dontLogUnlessSpecified', () => {
    it('dontLogUnlessSpecified - false', () => {
      logger.debug(['foo'], {dontLogUnlessSpecified:false});

      assertMessages('foo');
    });
    it('dontLogUnlessSpecified - true', () => {
      logger.debug(['foo'], {dontLogUnlessSpecified:true});

      assertLogTrail([]);
    });
  });

  describe('focusedLogging', () => {
    it('focusedLogging - false', () => {
      logger.setLogOptions({focusedLogging: false});
      logger.debug(['foo']);

      assertLogTrail(['foo']);
    })
    it('focusedLogging - true', () => {
      logger.setLogOptions({focusedLogging: true});
      logger.debug(['foo']);

      assertLogTrail([]);
    })

  });

  describe('throwOnError', () => {
    it('throwOnError - false', () => {
      logger.setLogOptions({throwOnError: false});
      logger.debug(['foo']);

      assertLogTrail(['foo']);
    })
    // it('throwOnError - true', () => {
    //   logger.setLogOptions({throwOnError: true,isError:true});
    //   logger.debug(['foo']);

    //   assertLogTrail(['ho']);
    // })

  });

  describe('prefix', () => {
    it('prefix - single', () => {
      logger.debug(['foo'],{prefix:1})

      assertMessages('foo');

      const formatWithPrefix = `- (1.) -`;

      assertMessages(formatWithPrefix);
    });
    it('prefix - multiple', () => {
      logger.debug(['foo'],{prefix:1})
      logger.debug(['bar'],{prefix:2})

      const formatWithPrefix = `- (1.) -`;

      assertLogTrail([formatWithPrefix,'(2.)'])
    });

  });

});

describe('Logger - Logging', () => {
  beforeEach(() => {
    logger = new Logger({scope: SCOPE_NAME});
  });

  it('Should log messages - single', () => {
    logger.debug(['foo']);

    (assertMessages('foo'));
  });
  it('Should log messages - multiple', () => {
    logger.debug(['foo']);
    logger.debug(['bar']);

    assertMessagesMany(['foo', 'bar']);
  });

});