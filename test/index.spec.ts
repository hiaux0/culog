import { Logger } from '../src';

const SCOPE_NAME = 'spec';

let logger: Logger;

function assertLogTrail(expectedLogTrail: string[]) {
  const logTrail = logger.getLogTrail();
   logTrail/*?*/
  expect(logTrail.length).toEqual(expectedLogTrail.length);

  logTrail.forEach((logMessage, index) => {
    const contentIncluded = logMessage[0].includes(expectedLogTrail[index])
    expect(contentIncluded).toBeTrue();
  })


}

function assertMessages(content: string, _logger: Logger = logger) {
  const logTrail = _logger.getLogTrail();
  logTrail/*?*/
  const hasContent = logTrail.some(logMessage => {
   logMessage/*?*/
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

  xit('scope', () => {
    logger.debug(['']);

    const formatedScopeName = `[${SCOPE_NAME}]`;

    assertMessages(formatedScopeName);
  });

  xit('deepLogObjects', () => {
    logger.debug(['foo %o', {bar:'baz'}], {deepLogObjects:true});

    assertMessages('foo');
    assertMessages('{"bar":"baz"}');
  });

  describe('dontLogUnlessSpecified', () => {
    xit('dontLogUnlessSpecified - false', () => {
      logger.debug(['foo'], {dontLogUnlessSpecified:false});

      assertMessages('foo');
    });
    xit('dontLogUnlessSpecified - true', () => {
      logger.debug(['foo'], {dontLogUnlessSpecified:true});

      assertLogTrail([]);
    });
  });

  describe('focusedLogging', () => {
    xit('focusedLogging - false', () => {
      logger.setLogOptions({focusedLogging: false});
      logger.debug(['foo']);

      assertLogTrail(['foo']);
    })
    xit('focusedLogging - true', () => {
      logger.setLogOptions({focusedLogging: true});
      logger.debug(['foo']);

      assertLogTrail([]);
    })

  });

  describe('throwOnError', () => {
    xit('throwOnError - false', () => {
      logger.setLogOptions({throwOnError: false});
      logger.debug(['foo']);

      assertLogTrail(['foo']);
    })
    // xit('throwOnError - true', () => {
    //   logger.setLogOptions({throwOnError: true,isError:true});
    //   logger.debug(['foo']);

    //   assertLogTrail(['ho']);
    // })

  });

  describe('prefix', () => {
    xit('prefix - single', () => {
      logger.debug(['foo'],{prefix:1})

      assertMessages('foo');

      const formatWithPrefix = `- (1.) -`;

      assertMessages(formatWithPrefix);
    });
    fit('prefix - multiple', () => {
      logger.debug(['foo'],{prefix:1})
      logger.debug(['bar'],{prefix:2})

      const formatWithPrefix = `- (1.) -`;

      assertLogTrail([formatWithPrefix,'(2.)'])
    });

  });

});

describe('Logger - Logging', () => {
  xit('Should log messages - single', () => {
    logger.debug(['foo']);

    (assertMessages('foo'));
  });
  xit('Should log messages - multiple', () => {
    logger.debug(['foo']);
    logger.debug(['bar']);

    assertMessagesMany(['foo', 'bar']);
  });

});