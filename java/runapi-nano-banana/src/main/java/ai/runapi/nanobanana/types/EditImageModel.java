package ai.runapi.nanobanana.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for edit image operations. */
public final class EditImageModel extends NanobananaValue {
  /** nano-banana-edit model slug. */
  public static final EditImageModel NANO_BANANA_EDIT = new EditImageModel("nano-banana-edit");

  /** nano-banana-2-lite model slug. */
  public static final EditImageModel NANO_BANANA_2_LITE = new EditImageModel("nano-banana-2-lite");

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public EditImageModel(String value) {
    super(value);
  }
}
