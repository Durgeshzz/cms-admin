import React from "react";
import { sortableContainer } from "react-sortable-hoc";

const SortableContainer = ({ children }) => {
  return <>{children}</>;
};

export default sortableContainer(SortableContainer);
