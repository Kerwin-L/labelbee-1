export default class StyleUtils {
  public static getStrokeAndFill(
    toolStyle: IToolColorStyle,
    valid = true,
    options: Partial<{
      isSelected: boolean;
      isHover: boolean;
    }> = {},
  ) {
    const { isSelected = false, isHover = false } = options;

    if (isSelected) {
      return {
        stroke: valid ? toolStyle.validSelected.stroke : toolStyle.invalidSelected.stroke,
        fill: valid ? toolStyle.validSelected.fill : toolStyle.invalidSelected.fill,
      };
    }

    if (isHover) {
      return {
        stroke: valid ? toolStyle.validHover.stroke : toolStyle.invalidHover.stroke,
        fill: valid ? toolStyle.validHover.fill : toolStyle.invalidHover.fill,
      };
    }

    return {
      stroke: valid ? toolStyle.valid.stroke : toolStyle.invalid.stroke,
      fill: valid ? toolStyle.valid.fill : toolStyle.invalid.fill,
    };
  }
}
