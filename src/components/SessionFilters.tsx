import { css, cx } from "styled-system/css";
import { Flex } from "styled-system/jsx";

import { type SessionFilterId, sessionFilters } from "../data/fixtures";

export interface SessionFiltersProps {
  activeFilter: SessionFilterId;
  onFilterChange: (filter: SessionFilterId) => void;
}

const chipClass = css({
  alignItems: "center",
  bg: "surface.base",
  borderColor: "border.primary",
  borderRadius: "full",
  borderStyle: "solid",
  borderWidth: "xs",
  color: "text.primary",
  cursor: "pointer",
  display: "inline-flex",
  h: "10",
  px: "4",
  textStyle: "t_small",
  userSelect: "none",
  _hover: { bg: "surface.subtle" },
  _focusVisible: {
    outlineColor: "focus.default",
    outlineOffset: "0.125rem",
    outlineStyle: "solid",
    outlineWidth: "0.125rem",
  },
});

const selectedChipClass = css({
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
  bg: "surface.brand",
  borderColor: "border.brand",
  color: "text.on_brand",
  _hover: { bg: "action.brand_hover" },
});

export function SessionFilters({
  activeFilter,
  onFilterChange,
}: SessionFiltersProps) {
  return (
    <Flex direction={{ base: "column", md: "row" }} gap="2">
      {sessionFilters.map((filter) => {
        const isSelected = filter.id === activeFilter;

        return (
          <button
            key={filter.id}
            className={cx(chipClass, isSelected && selectedChipClass)}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        );
      })}
    </Flex>
  );
}

SessionFilters.displayName = "SessionFilters";
