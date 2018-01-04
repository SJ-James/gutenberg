/**
 * WordPress dependencies
 */
import { MenuItemsGroup } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';
import CopyContentButton from '../copy-content-button';

export default function EditorActions() {
	return (
		<MenuItemsGroup className="editor-actions">
			<CopyContentButton />
		</MenuItemsGroup>
	);
}
