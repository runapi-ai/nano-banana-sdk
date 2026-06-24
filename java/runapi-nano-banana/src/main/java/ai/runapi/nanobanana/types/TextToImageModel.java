package ai.runapi.nanobanana.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for text to image operations. */
public final class TextToImageModel extends NanobananaValue {
  /** nano-banana model slug. */
  public static final TextToImageModel NANO_BANANA = new TextToImageModel("nano-banana");
  /** nano-banana-2 model slug. */
  public static final TextToImageModel NANO_BANANA_2 = new TextToImageModel("nano-banana-2");
  /** nano-banana-pro model slug. */
  public static final TextToImageModel NANO_BANANA_PRO = new TextToImageModel("nano-banana-pro");

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public TextToImageModel(String value) {
    super(value);
  }
}
