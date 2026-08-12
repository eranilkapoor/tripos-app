"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export type CrmTheme = "system" | "light" | "dark";

const crmThemes: { id: CrmTheme; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

const themeIcons = {
  system: faDesktop,
  light: faSun,
  dark: faMoon,
};

export default function ThemeSwitcher({
  onChange,
  selectedTheme,
}: {
  onChange: (theme: CrmTheme) => void;
  selectedTheme: CrmTheme;
}) {
  return (
    <fieldset className="theme-switcher">
      <legend>Theme</legend>
      <div className="theme-radio-group">
        {crmThemes.map((item) => (
          <label
            className={selectedTheme === item.id ? "selected" : ""}
            key={item.id}
            title={`${item.label} theme`}
          >
            <input
              checked={selectedTheme === item.id}
              onChange={() => onChange(item.id)}
              type="radio"
            />
            <FontAwesomeIcon aria-hidden icon={themeIcons[item.id]} />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
