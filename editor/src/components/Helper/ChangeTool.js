import Data from './Data';
import removeAllSelection from './RemoveSelection';

export default function(tool) {
	Data.editor.tool = tool;
	removeAllSelection(tool == 3);
}