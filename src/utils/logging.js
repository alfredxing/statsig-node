const LogEvent = require('../LogEvent');

const CONFIG_EXPOSURE_EVENT = 'config_exposure';
const GATE_EXPOSURE_EVENT = 'gate_exposure';
const INTERNAL_EVENT_PREFIX = 'statsig::';

function logGateExposure(user, gateName, gateValue, ruleID, eventProcessor) {
  logStatsigInternal(
    user,
    GATE_EXPOSURE_EVENT,
    { gate: gateName, gateValue: String(gateValue), ruleID: ruleID },
    eventProcessor
  );
}

function logConfigExposure(user, configName, ruleID, eventProcessor) {
  logStatsigInternal(
    user,
    CONFIG_EXPOSURE_EVENT,
    { config: configName, ruleID: ruleID },
    eventProcessor
  );
}

function logStatsigInternal(user, eventName, metadata, eventProcessor) {
  if (typeof eventProcessor.log !== 'function') {
    return;
  }
  let event = new LogEvent(INTERNAL_EVENT_PREFIX + eventName);
  if (user != null) {
    event.setUser(user);
  }

  if (metadata != null) {
    event.setMetadata(metadata);
  }

  if (metadata?.error != null) {
    eventProcessor.log(event, eventName + metadata.error);
  } else {
    eventProcessor.log(event);
  }
}

module.exports = {
  logConfigExposure,
  logGateExposure,
  logStatsigInternal,
};
