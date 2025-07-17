import PropTypes from "prop-types";
import { createContext, useMemo } from "react";
// utils
import getColorPresets, {
  colorPresets,
  defaultPreset,
} from "../utils/getColorPresets";
// config
import { defaultSettings } from "../config";

// ----------------------------------------------------------------------

const initialState = {
  ...defaultSettings,
  setColor: defaultPreset,
  colorOption: [],
};

const SettingsContext = createContext(initialState);

// ----------------------------------------------------------------------

SettingsProvider.propTypes = {
  children: PropTypes.node,
};

function SettingsProvider({ children }) {
  const settingProps = useMemo(() => ({
    ...defaultSettings,
    // Mode
    setColor: getColorPresets(defaultSettings.themeColorPresets),
    colorOption: colorPresets.map((color) => ({
      name: color.name,
      value: color.main,
    })),
  }), []);

  return (
    <SettingsContext.Provider value={settingProps}>
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };

// ----------------------------------------------------------------------
