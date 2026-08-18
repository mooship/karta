import {
  type KeyboardEvent as ReactKeyboardEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./FeatureBrowser.module.css";

/** One entry in a `FeatureBrowser` list. */
export interface FeatureBrowserEntry {
  /** The underlying feature's id, passed to `onSelect`. */
  id: string;
  /** Display label, and the basis for search filtering and type-ahead. */
  label: string;
  /** Groups this entry with others sharing the same value, e.g. a municipality id. Entries with no `groupId` render ungrouped. */
  groupId?: string;
  /** Heading shown above this entry's group. Ignored if `groupId` is omitted. */
  groupLabel?: string;
}

/** Props for `FeatureBrowser`. */
export interface FeatureBrowserProps {
  /** Accessible name for the browse list as a whole. */
  ariaLabel: string;
  entries: FeatureBrowserEntry[];
  /** The currently map-selected entry's id, if any, marked `aria-selected`. */
  selectedId?: string | null;
  onSelect: (id: string) => void;
  /** Whether to show a text filter above the list. Defaults to `false`. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Shown in place of the list when a search matches no entries. */
  emptyMessage?: string;
}

const TYPEAHEAD_RESET_MS = 500;

interface EntryGroup {
  groupId: string | undefined;
  groupLabel: string | undefined;
  entries: FeatureBrowserEntry[];
}

/** Groups `entries` by `groupId`, preserving first-seen group order. */
function groupEntries(entries: FeatureBrowserEntry[]): EntryGroup[] {
  const groups: EntryGroup[] = [];
  const indexByGroupId = new Map<string | undefined, number>();
  for (const entry of entries) {
    let index = indexByGroupId.get(entry.groupId);
    if (index === undefined) {
      index = groups.length;
      indexByGroupId.set(entry.groupId, index);
      groups.push({
        groupId: entry.groupId,
        groupLabel: entry.groupLabel,
        entries: [],
      });
    }
    // biome-ignore lint/style/noNonNullAssertion: index was just resolved (or just pushed) above, so groups[index] always exists
    groups[index]!.entries.push(entry);
  }
  return groups;
}

/**
 * A keyboard-navigable list for browsing a layer's features, independent of
 * map interaction — the generalization of a bespoke per-domain feature list.
 * @remarks Implements the WAI-ARIA listbox pattern: roving `tabIndex` (one
 *   focusable option at a time), Up/Down arrow navigation that crosses
 *   group boundaries, Home/End to jump to the first/last visible entry, and
 *   single-character type-ahead that cycles through entries starting with
 *   the typed letter. `entries` is grouped by `groupId` only when at least
 *   one entry declares one — a domain with no grouping field renders a flat
 *   list with no group headings at all. The optional search filter narrows
 *   `entries` by a case-insensitive substring match on `label` before
 *   grouping, so an empty group simply disappears rather than rendering
 *   with no visible entries.
 */
export function FeatureBrowser({
  ariaLabel,
  entries,
  selectedId,
  onSelect,
  searchable = false,
  searchPlaceholder,
  emptyMessage,
}: FeatureBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const typeaheadRef = useRef({ buffer: "", lastKeyTime: 0 });

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length === 0) {
      return entries;
    }
    return entries.filter((entry) => entry.label.toLowerCase().includes(query));
  }, [entries, searchQuery]);

  const groups = useMemo(
    () => groupEntries(filteredEntries),
    [filteredEntries],
  );
  const isGrouped = filteredEntries.some(
    (entry) => entry.groupId !== undefined,
  );
  const flatOrder = useMemo(
    () => groups.flatMap((group) => group.entries),
    [groups],
  );

  const [activeIndex, setActiveIndex] = useState(() => {
    const index = flatOrder.findIndex((entry) => entry.id === selectedId);
    return index >= 0 ? index : 0;
  });
  const safeActiveIndex = Math.min(
    activeIndex,
    Math.max(flatOrder.length - 1, 0),
  );

  function moveFocusTo(nextIndex: number) {
    setActiveIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  }

  function handleTypeahead(char: string, currentIndex: number) {
    const now = Date.now();
    if (now - typeaheadRef.current.lastKeyTime > TYPEAHEAD_RESET_MS) {
      typeaheadRef.current.buffer = "";
    }
    typeaheadRef.current.buffer += char.toLowerCase();
    typeaheadRef.current.lastKeyTime = now;
    const query = typeaheadRef.current.buffer;
    const total = flatOrder.length;
    for (let offset = 1; offset <= total; offset += 1) {
      const candidateIndex = (currentIndex + offset) % total;
      if (flatOrder[candidateIndex]?.label.toLowerCase().startsWith(query)) {
        moveFocusTo(candidateIndex);
        return;
      }
    }
  }

  function handleOptionKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>,
    index: number,
  ) {
    const total = flatOrder.length;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocusTo((index + 1) % total);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocusTo((index - 1 + total) % total);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      moveFocusTo(0);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      moveFocusTo(total - 1);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const entry = flatOrder[index];
      if (entry) {
        onSelect(entry.id);
      }
      return;
    }
    if (event.key.length === 1 && /[a-z0-9]/i.test(event.key)) {
      handleTypeahead(event.key, index);
    }
  }

  if (flatOrder.length === 0 && searchable) {
    return (
      <div
        className={styles.root}
        data-testid="feature-browser"
        data-e2e="feature-browser"
      >
        <input
          type="search"
          className={styles.search}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          data-testid="feature-browser-search"
          data-e2e="feature-browser-search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setActiveIndex(0);
          }}
        />
        {emptyMessage ? <p className={styles.empty}>{emptyMessage}</p> : null}
      </div>
    );
  }

  let flatIndex = 0;

  return (
    <div
      className={styles.root}
      data-testid="feature-browser"
      data-e2e="feature-browser"
    >
      {searchable ? (
        <input
          type="search"
          className={styles.search}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          data-testid="feature-browser-search"
          data-e2e="feature-browser-search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setActiveIndex(0);
          }}
        />
      ) : null}
      <div
        role="listbox"
        aria-label={ariaLabel}
        className={styles.listbox}
        data-testid="feature-browser-list"
        data-e2e="feature-browser-list"
      >
        {groups.map((group) => {
          const optionElements = group.entries.map((entry) => {
            const index = flatIndex;
            flatIndex += 1;
            return (
              <div
                key={entry.id}
                role="option"
                id={`feature-browser-option-${entry.id}`}
                aria-selected={entry.id === selectedId}
                tabIndex={index === safeActiveIndex ? 0 : -1}
                className={styles.option}
                data-testid={`feature-browser-option-${entry.id}`}
                data-e2e={`feature-browser-option-${entry.id}`}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                onClick={() => {
                  setActiveIndex(index);
                  onSelect(entry.id);
                }}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
              >
                {entry.label}
              </div>
            );
          });

          if (!isGrouped) {
            return optionElements;
          }

          return (
            <fieldset
              key={group.groupId ?? "__ungrouped"}
              className={styles.group}
            >
              {group.groupLabel ? (
                <legend
                  className={styles.groupHeading}
                  data-testid={`feature-browser-group-${group.groupId ?? "ungrouped"}`}
                  data-e2e={`feature-browser-group-${group.groupId ?? "ungrouped"}`}
                >
                  {group.groupLabel}
                </legend>
              ) : null}
              {optionElements}
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}
