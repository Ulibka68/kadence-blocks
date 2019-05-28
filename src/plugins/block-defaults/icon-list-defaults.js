import TypographyControls from '../../typography-control';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import IcoNames from '../../svgiconsnames';
import FaIco from '../../faicons';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import MeasurementControls from '../../measurement-control';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	ColorPalette,
} = wp.editor;
const {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	Modal,
} = wp.components;

import icons from '../../icons';

class KadenceIconListDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
			marginControl: 'individual',
		};
	}
	componentDidMount() {
		const iconListConfig = ( this.state.configuration && this.state.configuration[ 'kadence/iconlist' ] ? this.state.configuration[ 'kadence/iconlist' ] : {} );
		if ( undefined !== iconListConfig.listMargin && undefined !== iconListConfig.listMargin[ 0 ] ) {
			if ( iconListConfig.listMargin[ 0 ] === iconListConfig.listMargin[ 1 ] && iconListConfig.listMargin[ 0 ] === iconListConfig.listMargin[ 2 ] && iconListConfig.listMargin[ 0 ] === iconListConfig.listMargin[ 3 ] ) {
				this.setState( { marginControl: 'linked' } );
			} else {
				this.setState( { marginControl: 'individual' } );
			}
		}
	}
	saveConfig( blockID, settingArray ) {
		this.setState( { isSaving: true } );
		const config = this.state.configuration;
		if ( ! config[ blockID ] ) {
			config[ blockID ] = {};
		}
		config[ blockID ] = settingArray;
		const settingModel = new wp.api.models.Settings( { kadence_blocks_config_blocks: JSON.stringify( config ) } );
		settingModel.save().then( response => {
			this.setState( { isSaving: false, configuration: config, isOpen: false } );
			kadence_blocks_params.configuration = JSON.stringify( config );
		} );
	}
	saveConfigState( key, value ) {
		const config = this.state.configuration;
		if ( ! config[ 'kadence/iconlist' ] ) {
			config[ 'kadence/iconlist' ] = {};
		}
		config[ 'kadence/iconlist' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const iconListConfig = ( configuration && configuration[ 'kadence/iconlist' ] ? configuration[ 'kadence/iconlist' ] : {} );
		const itemDefaults = [ {
			icon: 'fe_checkCircle',
			link: '',
			target: '_self',
			size: 20,
			width: 2,
			text: '',
			color: '',
			background: '',
			border: '',
			borderRadius: 0,
			padding: 5,
			borderWidth: 1,
			style: 'default',
		} ];
		const items = ( undefined !== iconListConfig.items && iconListConfig.items[ 0 ] ? iconListConfig.items : itemDefaults );
		const saveListItem = ( value ) => {
			const newUpdate = items.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'items', newUpdate );
		};
		const listDefaultStyles = [ {
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			family: '',
			google: false,
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
			color: '',
			textTransform: '',
		} ];
		const listStyles = ( undefined !== iconListConfig.listStyles && iconListConfig.listStyles[ 0 ] ? iconListConfig.listStyles : listDefaultStyles );
		const saveListStyles = ( value ) => {
			const newUpdate = listStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'listStyles', newUpdate );
		};
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
		);
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.iconlistBlock }</span>
					{ __( 'Icon List' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Icon List' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/iconlist', iconListConfig );
						} }>
						<PanelBody
							title={ __( 'List Controls' ) }
							initialOpen={ true }
						>
							<RangeControl
								label={ __( 'List Columns' ) }
								value={ ( undefined !== iconListConfig.columns ? iconListConfig.columns : 1 ) }
								onChange={ value => this.saveConfigState( 'columns', value ) }
								min={ 1 }
								max={ 3 }
							/>
							<RangeControl
								label={ __( 'List Vertical Spacing' ) }
								value={ ( undefined !== iconListConfig.listGap ? iconListConfig.listGap : 5 ) }
								onChange={ value => this.saveConfigState( 'listGap', value ) }
								min={ 0 }
								max={ 60 }
							/>
							<RangeControl
								label={ __( 'List Horizontal Icon and Label Spacing' ) }
								value={ ( undefined !== iconListConfig.listLabelGap ? iconListConfig.listLabelGap : 10 ) }
								onChange={ value => this.saveConfigState( 'listLabelGap', value ) }
								min={ 0 }
								max={ 60 }
							/>
							<MeasurementControls
								label={ __( 'List Margin' ) }
								measurement={ ( undefined !== iconListConfig.listMargin ? iconListConfig.listMargin : [ 0, 0, 10, 0 ] ) }
								control={ this.state.marginControl }
								onChange={ ( value ) => this.saveConfigState( 'listMargin', value ) }
								onControl={ ( value ) => this.setState( { marginControl: value } ) }
								min={ -200 }
								max={ 200 }
								step={ 1 }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'List Text Styling' ) }
							initialOpen={ false }
						>
							<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
							<ColorPalette
								value={ listStyles[ 0 ].color }
								onChange={ value => saveListStyles( { color: value } ) }
							/>
							<TypographyControls
								fontSize={ listStyles[ 0 ].size }
								onFontSize={ ( value ) => saveListStyles( { size: value } ) }
								fontSizeType={ listStyles[ 0 ].sizeType }
								onFontSizeType={ ( value ) => saveListStyles( { sizeType: value } ) }
								lineHeight={ listStyles[ 0 ].lineHeight }
								onLineHeight={ ( value ) => saveListStyles( { lineHeight: value } ) }
								lineHeightType={ listStyles[ 0 ].lineType }
								onLineHeightType={ ( value ) => saveListStyles( { lineType: value } ) }
								letterSpacing={ listStyles[ 0 ].letterSpacing }
								onLetterSpacing={ ( value ) => saveListStyles( { letterSpacing: value } ) }
								fontFamily={ listStyles[ 0 ].family }
								onFontFamily={ ( value ) => saveListStyles( { family: value } ) }
								onFontChange={ ( select ) => {
									saveListStyles( {
										family: select.value,
										google: select.google,
									} );
								} }
								onFontArrayChange={ ( values ) => saveListStyles( values ) }
								googleFont={ listStyles[ 0 ].google }
								onGoogleFont={ ( value ) => saveListStyles( { google: value } ) }
								loadGoogleFont={ listStyles[ 0 ].loadGoogle }
								onLoadGoogleFont={ ( value ) => saveListStyles( { loadGoogle: value } ) }
								fontVariant={ listStyles[ 0 ].variant }
								onFontVariant={ ( value ) => saveListStyles( { variant: value } ) }
								fontWeight={ listStyles[ 0 ].weight }
								onFontWeight={ ( value ) => saveListStyles( { weight: value } ) }
								fontStyle={ listStyles[ 0 ].style }
								onFontStyle={ ( value ) => saveListStyles( { style: value } ) }
								fontSubset={ listStyles[ 0 ].subset }
								onFontSubset={ ( value ) => saveListStyles( { subset: value } ) }
								textTransform={ listStyles[ 0 ].textTransform }
								onTextTransform={ ( value ) => saveListStyles( { textTransform: value } ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'List Icon Styles' ) }
							initialOpen={ false }
						>
							<FontIconPicker
								icons={ IcoNames }
								value={ items[ 0 ].icon }
								onChange={ value => {
									saveListItem( { icon: value } );
								} }
								renderFunc={ renderSVG }
								theme="default"
								isMulti={ false }
								appendTo={ false }
								closeOnSelect={ true }
							/>
							<RangeControl
								label={ __( 'Icon Size' ) }
								value={ items[ 0 ].size }
								onChange={ value => {
									saveListItem( { size: value } );
								} }
								min={ 5 }
								max={ 250 }
							/>
							{ items[ 0 ].icon && 'fe' === items[ 0 ].icon.substring( 0, 2 ) && (
								<RangeControl
									label={ __( 'Line Width' ) }
									value={ items[ 0 ].width }
									onChange={ value => {
										saveListItem( { width: value } );
									} }
									step={ 0.5 }
									min={ 0.5 }
									max={ 4 }
								/>
							) }
							<p className="kt-setting-label">{ __( 'Icon Color' ) }</p>
							<ColorPalette
								value={ items[ 0 ].color }
								onChange={ value => {
									saveListItem( { color: value } );
								} }
							/>
							<SelectControl
								label={ __( 'Icon Style' ) }
								value={ items[ 0 ].style }
								options={ [
									{ value: 'default', label: __( 'Default' ) },
									{ value: 'stacked', label: __( 'Stacked' ) },
								] }
								onChange={ value => {
									saveListItem( { style: value } );
								} }
							/>
							{ items[ 0 ].style !== 'default' && (
								<Fragment>
									<p className="kt-setting-label">{ __( 'Icon Background' ) }</p>
									<ColorPalette
										value={ items[ 0 ].background }
										onChange={ value => {
											saveListItem( { background: value } );
										} }
									/>
								</Fragment>
							) }
							{ items[ 0 ].style !== 'default' && (
								<Fragment>
									<p className="kt-setting-label">{ __( 'Border Color' ) }</p>
									<ColorPalette
										value={ items[ 0 ].border }
										onChange={ value => {
											saveListItem( { border: value } );
										} }
									/>
								</Fragment>
							) }
							{ items[ 0 ].style !== 'default' && (
								<RangeControl
									label={ __( 'Border Size (px)' ) }
									value={ items[ 0 ].borderWidth }
									onChange={ value => {
										saveListItem( { borderWidth: value } );
									} }
									min={ 0 }
									max={ 20 }
								/>
							) }
							{ items[ 0 ].style !== 'default' && (
								<RangeControl
									label={ __( 'Border Radius (%)' ) }
									value={ items[ 0 ].borderRadius }
									onChange={ value => {
										saveListItem( { borderRadius: value } );
									} }
									min={ 0 }
									max={ 50 }
								/>
							) }
							{ items[ 0 ].style !== 'default' && (
								<RangeControl
									label={ __( 'Padding (px)' ) }
									value={ items[ 0 ].padding }
									onChange={ value => {
										saveListItem( { padding: value } );
									} }
									min={ 0 }
									max={ 180 }
								/>
							) }
						</PanelBody>
						<Button className="kt-defaults-save" isDefault isPrimary onClick={ () => {
							this.saveConfig( 'kadence/iconlist', iconListConfig );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceIconListDefault;
