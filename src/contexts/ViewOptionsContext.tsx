import * as React from "react";
import { ViewOptions } from "../constants/MusicTypes";
import { SortField } from "../utils/ArrayUtilities";
import songDataFields from "../constants/songDataFields.json";

const defaultViewOptions: ViewOptions = { fadeInactive: false, hiddenColumns: [songDataFields.ID] };

export interface ViewOptionsContextType {
  viewOptions: ViewOptions;
  setViewOptions: (newOptions: ViewOptions) => void;
  sortColumns: SortField[];
  toggleSortColumn: (columnField: string) => void;
  resetSorting: () => void;
}

export const ViewOptionsContext = React.createContext<ViewOptionsContextType>({
  viewOptions: defaultViewOptions,
  setViewOptions: () => null,
  sortColumns: [],
  toggleSortColumn: () => null,
  resetSorting: () => null,
});

export const ViewOptionsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const [viewOptions, setViewOptions] = React.useState<ViewOptions>(defaultViewOptions);
  const [sortColumns, setSortColumns] = React.useState<SortField[]>([]);

  const toggleSortColumn = React.useCallback(
    (columnField: string) => {
      const column = sortColumns.find((c) => c.fieldName === columnField);
      if (typeof column === "undefined") {
        // Column isn't in the list, add it in asc mode
        setSortColumns((prevSortColumns) => [
          ...prevSortColumns,
          {
            fieldName: columnField,
            direction: "ascending",
          },
        ]);
      } else if (column.direction === "ascending") {
        // Column is in the list asc -> switch to desc
        setSortColumns((prevSortColumns) =>
          prevSortColumns.map((sc) =>
            sc.fieldName === columnField ? { ...sc, direction: "descending" } : sc
          )
        );
      } else {
        // Column is in the list desc -> remove it
        setSortColumns((prevSortColumns) => prevSortColumns.filter((c) => c !== column));
      }
    },
    [sortColumns]
  );

  React.useEffect(() => console.table(sortColumns), [sortColumns]);

  const state = React.useMemo(
    () => ({
      viewOptions,
      setViewOptions,
      sortColumns,
      toggleSortColumn,
      resetSorting: () => {
        setSortColumns([]);
      },
    }),
    [sortColumns, toggleSortColumn, viewOptions]
  );
  return <ViewOptionsContext.Provider value={state}>{children}</ViewOptionsContext.Provider>;
};

export const useViewOptionsContext = (): ViewOptionsContextType =>
  React.useContext(ViewOptionsContext);
