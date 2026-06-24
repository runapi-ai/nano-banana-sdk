package ai.runapi.nanobanana.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Parameters for text to image operations. */
public final class TextToImageParams {
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
    raw.put("model", NanobananaParamUtils.wireValue(model));
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

    /** Sets the model slug using a typed model value. */
    public Builder model(TextToImageModel value) {
      this.model = java.util.Objects.requireNonNull(value, "model").value();
      return this;
    }

    /** Sets the model slug using a string value. */
    public Builder model(String value) {
      this.model = NanobananaParamUtils.requireNonBlankTrim(value, "model");
      return this;
    }


    /** Sets the text prompt. */
    public Builder prompt(String value) {
      this.prompt = NanobananaParamUtils.requireNonBlank(value, "prompt");
      return this;
    }

    /** Sets the webhook URL for task completion notifications. */
    public Builder callbackUrl(String value) {
      this.callbackUrl = NanobananaParamUtils.requireNonBlank(value, "callbackUrl");
      return this;
    }

    /** Sets the output format. */
    public Builder outputFormat(String value) {
      this.outputFormat = NanobananaParamUtils.requireNonBlank(value, "outputFormat");
      return this;
    }

    /** Sets the output aspect ratio. */
    public Builder aspectRatio(String value) {
      this.aspectRatio = NanobananaParamUtils.requireNonBlank(value, "aspectRatio");
      return this;
    }

    /** Sets the output resolution. */
    public Builder outputResolution(String value) {
      this.outputResolution = NanobananaParamUtils.requireNonBlank(value, "outputResolution");
      return this;
    }

    /** Sets the reference image URLs. */
    public Builder referenceImageUrls(List<String> value) {
      this.referenceImageUrls = value;
      return this;
    }

    /** Builds immutable text to image parameters. */
    public TextToImageParams build() {
      return new TextToImageParams(this);
    }
  }
}
