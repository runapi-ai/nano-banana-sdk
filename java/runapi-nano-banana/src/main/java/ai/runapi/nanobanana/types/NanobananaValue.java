package ai.runapi.nanobanana.types;

import ai.runapi.core.types.RunApiValue;

abstract class NanobananaValue extends RunApiValue {
  NanobananaValue(String value) {
    super(value);
  }
}
