package ai.runapi.nanobanana.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Parameters for edit image operations. nano-banana-edit supports output format
 * control; nano-banana-2-lite requires aspect_ratio and does not support
 * output_format.
 */
public final class EditImageParams {
  private static final String DEFAULT_MODEL = "nano-banana-2-lite";

  private final String model;
  private final String prompt;
  private final String callbackUrl;
  private final String outputFormat;
  private final String aspectRatio;
  private final List<String> sourceImageUrls;

  private EditImageParams(Builder builder) {
    this.model = builder.model;
    this.prompt = builder.prompt;
    this.callbackUrl = builder.callbackUrl;
    this.outputFormat = builder.outputFormat;
    this.aspectRatio = builder.aspectRatio;
    this.sourceImageUrls = NanobananaParamUtils.strings(builder.sourceImageUrls);
  }

  /** Creates a new EditImageParams builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the RunAPI action key for this request. */
  public String action() {
    return "nano-banana/edit-image";
  }

  /** Converts these parameters to the JSON request body shape. */
  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("model", NanobananaParamUtils.wireValue(modelOrDefault()));
    raw.put("prompt", NanobananaParamUtils.wireValue(prompt));
    raw.put("callback_url", NanobananaParamUtils.wireValue(callbackUrl));
    raw.put("output_format", NanobananaParamUtils.wireValue(outputFormat));
    raw.put("aspect_ratio", NanobananaParamUtils.wireValue(aspectRatio));
    raw.put("source_image_urls", NanobananaParamUtils.wireValue(sourceImageUrls));
    return NanobananaParamUtils.compact(raw);
  }



  /** Builder for {@link EditImageParams}. */
  public static final class Builder {
    private String model;
    private String prompt;
    private String callbackUrl;
    private String outputFormat;
    private String aspectRatio;
    private List<String> sourceImageUrls;

    private Builder() {}

    /** Sets the model slug using a typed model value. Defaults to nano-banana-2-lite when omitted. */
    public Builder model(EditImageModel value) {
      this.model = java.util.Objects.requireNonNull(value, "model").value();
      return this;
    }

    /** Sets the model slug using a string value. Defaults to nano-banana-2-lite when omitted. */
    public Builder model(String value) {
      this.model = value;
      return this;
    }


    /** Sets the text prompt. */
    public Builder prompt(String value) {
      this.prompt = value;
      return this;
    }

    /** Sets the webhook URL for task completion notifications. */
    public Builder callbackUrl(String value) {
      this.callbackUrl = value;
      return this;
    }

    /** Sets the output format. */
    public Builder outputFormat(String value) {
      this.outputFormat = value;
      return this;
    }

    /** Sets the output aspect ratio. */
    public Builder aspectRatio(String value) {
      this.aspectRatio = value;
      return this;
    }

    /** Sets the source image URLs. */
    public Builder sourceImageUrls(List<String> value) {
      this.sourceImageUrls = value;
      return this;
    }

    /** Builds immutable edit image parameters. */
    public EditImageParams build() {
      return new EditImageParams(this);
    }
  }

  private String modelOrDefault() {
    return model == null || model.trim().isEmpty() ? DEFAULT_MODEL : model;
  }
}
