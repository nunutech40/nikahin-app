import { DynamicThemeConfig } from "@/types/invitation";
import { STANDARD_THEME_CONFIG } from "./presets";

/**
 * DEFAULT MASTER CONFIGURATION
 * 
 * This is the fallback configuration for new themes or when a theme
 * has no specific config defined. It uses the "Standard" preset by default.
 */
export const MASTER_THEME_CONFIG: DynamicThemeConfig = STANDARD_THEME_CONFIG;
