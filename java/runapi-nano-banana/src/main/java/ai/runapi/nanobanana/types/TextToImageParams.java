package ai.runapi.nanobanana.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Parameters for text to image operations. Field support varies by model variant. */
public final class TextToImageParams {
  private static final String DEFAULT_MODEL = "nano-banana-2-lite";

  private final String model;
  private final String prompt;
  private final String callbackUrl;
  private final String outputFormat;
  private final String aspectRatio;
  private final String outputResolution;
  private final List<String> referenceImageUrls;

  private TextToImageParams(Builder builder) {
    this.model = builder.model;
    this.prompt = builder.prompt;
    this.callbackUrl = builder.callbackUrl;
    this.outputFormat = builder.outputFormat;
    this.aspectRatio = builder.aspectRatio;
    this.outputResolution = builder.outputResolution;
    this.referenceImageUrls = NanobananaParamUtils.strings(builder.referenceImageUrls);
  }

  /** Creates a new TextToImageParams builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the RunAPI action key for this request. */
  public String action() {
    return "nano-banana/text-to-image";
  }

  /** Converts these parameters to the JSON request body shape. */
  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("model", NanobananaParamUtils.wireValue(modelOrDefault()));
    raw.put("prompt", NanobananaParamUtils.wireValue(prompt));
    raw.put("callback_url", NanobananaParamUtils.wireValue(callbackUrl));
    raw.put("output_format", NanobananaParamUtils.wireValue(outputFormat));
    raw.put("aspect_ratio", NanobananaParamUtils.wireValue(aspectRatio));
    raw.put("output_resolution", NanobananaParamUtils.wireValue(outputResolution));
    raw.put("reference_image_urls", NanobananaParamUtils.wireValue(referenceImageUrls));
    return NanobananaParamUtils.compact(raw);
  }



  /** Builder for {@link TextToImageParams}. */
  public static final class Builder {
    private String model;
    private String prompt;
    private String callbackUrl;
    private String outputFormat;
    private String aspectRatio;
    private String outputResolution;
    private List<String> referenceImageUrls;

    private Builder() {}

    /** Sets the model slug using a typed model value. Defaults to nano-banana-2-lite when omitted. */
    public Builder model(TextToImageModel value) {
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

    /** Sets the output format. V2.1 accepts png or jpg and defaults to jpg. Not supported by nano-banana-2-lite. */
    public Builder outputFormat(String value) {
      this.outputFormat = value;
      return this;
    }

    /** Sets the output aspect ratio. Required for nano-banana-2-lite. */
    public Builder aspectRatio(String value) {
      this.aspectRatio = value;
      return this;
    }

    /** Sets the output resolution. V2.1 accepts 1k, 2k, or 4k and defaults to 1k. Not supported by nano-banana-2-lite. */
    public Builder outputResolution(String value) {
      this.outputResolution = value;
      return this;
    }

    /** Sets the reference image URLs. V2.1 and Lite accept up to 10 images; other limits vary by model. */
    public Builder referenceImageUrls(List<String> value) {
      this.referenceImageUrls = value;
      return this;
    }

    /** Builds immutable text to image parameters. */
    public TextToImageParams build() {
      return new TextToImageParams(this);
    }
  }

  private String modelOrDefault() {
    return model == null || model.trim().isEmpty() ? DEFAULT_MODEL : model;
  }
}
