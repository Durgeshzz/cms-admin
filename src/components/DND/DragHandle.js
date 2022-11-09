import React from "react";
import { sortableHandle } from "react-sortable-hoc";

const DragHandle = sortableHandle(() => <span className="drag-icon slide-drag pull-left">
<i className="fa">&#xf142;</i>
<i className="fa">&#xf142;</i>
</span>);

export default DragHandle;
