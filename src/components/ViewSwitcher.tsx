import { css } from 'styled-system/css';
import type { KeyboardEvent } from 'react';

import { type ViewId, views } from '../data/fixtures';

export interface ViewSwitcherProps {
  idPrefix: string;
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
}

const tabClass = css({
  alignItems: 'center',
  bg: 'transparent',
  cursor: 'pointer',
  borderBottomColor: 'transparent',
  borderBottomStyle: 'solid',
  borderBottomWidth: 'sm',
  color: 'text.primary',
  display: 'inline-flex',
  px: '4',
  py: '2',
  textDecoration: 'none',
  textStyle: 't_small_b',
  _hover: { color: 'text.link_hover' },
  '&[aria-selected=true]': {
    borderBottomColor: 'border.selected',
    color: 'text.selected',
  },
  _focusVisible: {
    outlineColor: 'focus.default',
    outlineOffset: '0.125rem',
    outlineStyle: 'solid',
    outlineWidth: '0.125rem',
  },
});

export function ViewSwitcher({ idPrefix, activeView, onViewChange }: ViewSwitcherProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const nextKeys = ['ArrowRight', 'ArrowDown'];
    const previousKeys = ['ArrowLeft', 'ArrowUp'];
    let nextIndex: number;

    if (nextKeys.includes(event.key)) {
      nextIndex = (index + 1) % views.length;
    } else if (previousKeys.includes(event.key)) {
      nextIndex = (index - 1 + views.length) % views.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = views.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextView = views[nextIndex];
    if (nextView) {
      document.getElementById(`${idPrefix}-tab-${nextView.id}`)?.focus();
      onViewChange(nextView.id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Views"
      className={css({
        borderBottomColor: 'border.secondary',
        borderBottomStyle: 'solid',
        borderBottomWidth: 'xs',
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        gap: '2',
      })}
    >
      {views.map((view, index) => (
        <button
          key={view.id}
          type="button"
          id={`${idPrefix}-tab-${view.id}`}
          aria-controls={`${idPrefix}-panel-${view.id}`}
          tabIndex={view.id === activeView ? 0 : -1}
          role="tab"
          aria-selected={view.id === activeView}
          className={tabClass}
          onClick={() => onViewChange(view.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
}

ViewSwitcher.displayName = 'ViewSwitcher';
