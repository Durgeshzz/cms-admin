import React from "react";
import { sortableElement } from "react-sortable-hoc";
// import DragHandle from "./DragHandle";

// const SortableItem = sortableElement((props) => (
//   <li>
//     <DragHandle />
//     {props.value}
//     {props.id}
//   </li>
// ));

const SortableItem = sortableElement(({ children }) => <>{children}</>);

export default SortableItem;
