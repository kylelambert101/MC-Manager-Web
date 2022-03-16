import React from "react";
import { IColumn } from "@fluentui/react";
import { getUniqueValuesByField } from "./ArrayUtilities";
import { convertToTitleCase } from "./StringUtilities";
import { getProperties, TypedProperty } from "./ObjectUtilities";
import songDataFields from "../constants/songDataFields.json";
import { SongData, SongDataColumn } from "../constants/MusicTypes";

/**
 * Get the display name associated with this `field`
 * @param field Field to convert to a display name
 */
export const getDisplayName = (field: string): string => {
  // Try to find a matching song data field and use its displayName
  const matchingSongDataField = Object.keys(songDataFields)
    .map((k) => Reflect.get(songDataFields, k) as SongDataColumn)
    .find((f) => f.name === field);
  if (matchingSongDataField) {
    return matchingSongDataField.displayName;
  }
  // By default, convert the field to titlecase and replace underscores with spaces
  return convertToTitleCase(field.replace(/_/g, " "));
};

/**
 * Get an array of IColumns that can be used for a list of objects
 */
export const getColumnsFromObjectArray = (objects: Record<string, unknown>[]): IColumn[] => {
  const allFields = objects
    // Get properties of all objects
    .map((obj) => getProperties(obj))
    // Flatten the array of property arrays
    .flat()
    // Stringify each TypedProperty for comparison
    .map((item) => JSON.stringify(item))
    // Filter to unique values
    .filter((value, index, self) => {
      return self.indexOf(value) === index;
    })
    // Convert stringified values back to TypedProperty objects
    .map((itemString) => JSON.parse(itemString) as TypedProperty);

  // Order is going to be determined by when the above map function encountered each field
  //   console.log(allFields);

  // Map the allFields array to an array of IColumns, using the name and type
  return allFields.map((field) => {
    const displayName = getDisplayName(field.name);
    const uniqueValueLengths = getUniqueValuesByField(field.name, objects).map(
      (item) => `${item}`.length
    );
    const defaultColumnSize = Math.min(500, 7 * Math.max(field.name.length, ...uniqueValueLengths));
    return {
      key: `column_${field.name}`,
      name: displayName,
      fieldName: field.name,
      minWidth: defaultColumnSize,
      isResizable: true,
      isCollapsable: false,
      data: field.dataType,
      // eslint-disable-next-line react/display-name
      onRender: (item: SongData) => {
        // return getFieldAdjustedComponent(item, field);
        return <span>{`${Reflect.get(item, field.name)}`}</span>;
      },
    } as IColumn;
  });
};
