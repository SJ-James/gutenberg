/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dashicon, ClipboardButton, Button } from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal Dependencies
 */
import './style.scss';
import { isEditedPostNew, getEditedPostAttribute } from '../../store/selectors';

class PostPermalink extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			showCopyConfirmation: false,
			editingSlug: false,
		};
		this.onCopy = this.onCopy.bind( this );
		this.onEditPermalink = this.onEditPermalink.bind( this );
		this.onSavePermalink = this.onSavePermalink.bind( this );
	}

	componentWillUnmount() {
		clearTimeout( this.dismissCopyConfirmation );
	}

	onCopy() {
		this.setState( {
			showCopyConfirmation: true,
		} );

		clearTimeout( this.dismissCopyConfirmation );
		this.dismissCopyConfirmation = setTimeout( () => {
			this.setState( {
				showCopyConfirmation: false,
			} );
		}, 4000 );
	}

	onEditPermalink( event ) {
		this.setState( { editingSlug: true } );
	}

	onSavePermalink( event ) {
		this.setState( { editingSlug: false } );
	}

	render() {
		const { isNew, link, samplePermalink } = this.props;
		const { showCopyConfirmation, editingSlug } = this.state;
		if ( isNew || ! link ) {
			return null;
		}

		let permalink = link,
			viewLink = link;
		if ( samplePermalink ) {
			permalink = samplePermalink[ 0 ].replace( '%postname%', samplePermalink[ 1 ] );
			viewLink = addQueryArgs( viewLink, { preview: true } );
		}

		const prefix = permalink.replace( /[^/]+\/?$/, '' ),
			slug = permalink.replace( /.*\/([^/]+)\/?$/, '$1' );

		return (
			<div className="editor-post-permalink">
				<Dashicon icon="admin-links" />
				<span className="editor-post-permalink__label">{ __( 'Permalink:' ) }</span>
				{ ! editingSlug && <Button
						className="editor-post-permalink__link"
						href={ viewLink }
						target="_blank"
					>
						{ permalink }
					</Button>
				}
				{ editingSlug &&
					<form className="editor-post-permalink__slug-form" onSubmit={ this.onSavePermalink }>
						<span className="editor-post-permalink__prefix">
							{ prefix }
						</span>
						<input
							type="text"
							className="editor-post-permalink__slug-input"
							value={ slug }
							required
						/>
						/
						<Button
							className="editor-post-permalink__save"
							onClick={ this.onSavePermalink }
							isLarge
						>
							{ __( 'Ok' ) }
						</Button>
					</form>
				}
				{ ! editingSlug &&
					<Button
						className="editor-post-permalink__edit"
						onClick={ this.onEditPermalink }
						isLarge
					>
						{ __( 'Edit' ) }
					</Button>
				}
			</div>
		);
	}
}

export default connect(
	( state ) => {
		return {
			isNew: isEditedPostNew( state ),
			link: getEditedPostAttribute( state, 'link' ),
			samplePermalink: getEditedPostAttribute( state, 'sample_permalink' ),
		};
	}
)( PostPermalink );

