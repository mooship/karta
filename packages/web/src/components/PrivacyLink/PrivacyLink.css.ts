import { style } from "@vanilla-extract/css";
import { link as sharedLink } from "../../shared.css";
import { appVars } from "../../theme/app.css";

export const link = style([
  sharedLink,
  {
    alignSelf: "flex-start",
    fontFamily: appVars.font.body,
    fontSize: appVars.fontSize.md,
  },
]);
