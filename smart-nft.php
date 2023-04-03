<?php 
/**
 * Plugin Name:       Smart Nft
 * Plugin URI:        https://smartnft.tophivetheme.com/
 * Description:       Smart NFT is a plugin to create your own Marketplace for creating and settings NFTs. Deploy your contract, add NFTs and Sell
 * Version:           2.0.0
 * Requires at least: 5.0
 * Requires PHP:      7.2
 * Author:            Tophive 
 * Author URI:        https://codecanyon.net/user/tophive
 * License:           Envato Licence 2.0
 * Text Domain:       smartnft
 * Domain Path:       /languages
 */


class SmartNftBase {
	public $slug = "smartnft";

	function __construct() {
		$this->constant();
		add_action( 'admin_menu', array($this,"smartnft_add_setting_page") );
		add_action( "admin_enqueue_scripts", array($this,"smartnft_enqueue_backend_script"));
		add_action( "wp_enqueue_scripts", array($this,"smartnft_enqueue_frontend_script"));
		$this->smartnft_include_utils();
		$this->smartnft_include_backend_main_files();
		$this->smartnft_include_frontend_main_files();
	}

	public function constant () {
		define( "BACKEND_SCRIPT_URL",	plugins_url('backend/assets/js/',__FILE__));
		define( "BACKEND_STYLE_URL", 	plugins_url('backend/assets/css/',__FILE__));
	  	define( "BACKEND_MEDIA_URL",	plugins_url('backend/assets/images/',__FILE__));
		define( "PLUGIN_ROOT",			plugin_dir_path(__FILE__) ); //use plugin_dir_path(important)

		define( "FRONTEND_SCRIPT_URL",	plugins_url('frontend/assets/js/',__FILE__));
		define( "FRONTEND_STYLE_URL", 	plugins_url('frontend/assets/css/',__FILE__));
	  	define( "FRONTEND_MEDIA_URL",	plugins_url('frontend/assets/images/',__FILE__));

	  	define( "WP_SMART_NFT", 'smartnft' );
	}

	public function smartnft_include_utils () {
		include "backend/utils/utils.php";
	}

	public function smartnft_include_backend_main_files () {
		include "backend/backend.php";
	}

	public function smartnft_include_frontend_main_files () {
		include "frontend/frontend.php";
	}

	public function smartnft_add_setting_page () {
		add_menu_page(
			esc_html__("Smart NFT",$this->slug),
			esc_html__("Smart NFT",$this->slug),
			"edit_theme_options",
			"smartnft",
			array($this,"render_root_page"),
			BACKEND_MEDIA_URL . 'logo.png',
			10
		);
		
		add_submenu_page(
			"smartnft",
			esc_html__("NFT List",$this->slug ),
			esc_html__("NFT List",$this->slug ),
			"edit_theme_options",
			"smartnft",
			array($this,"render_root_page"),
		);

		add_submenu_page(
			"smartnft",
			esc_html__("Add new",$this->slug ),
			esc_html__("Add new",$this->slug ),
			"edit_theme_options",
			"smartnft_new",
			array($this,"render_root_page"),
		);

		
		add_submenu_page(
			"smartnft",
			esc_html__("Smart Contracts",$this->slug ),
			esc_html__("Smart Contracts",$this->slug ),
			"edit_theme_options",
			"smartnft-contracts",
			array($this,"render_root_page"),
		);
		
		add_submenu_page(
			"smartnft",
			esc_html__("Collections",$this->slug ),
			esc_html__("Collections",$this->slug ),
			"edit_theme_options",
			"smartnft-collections",
			array($this,"render_root_page"),
		);
		
		add_submenu_page(
			"smartnft",
			esc_html__("Category",$this->slug ),
			esc_html__("Category",$this->slug ),
			"edit_theme_options",
			"smartnft-category",
			array($this,"render_root_page"),
		);

		add_submenu_page(
			"smartnft",
			esc_html__("Settings",$this->slug ),
			esc_html__("Settings",$this->slug ),
			"edit_theme_options",
			"smartnft-settings",
			array($this,"render_root_page"),
		);

		add_submenu_page(
			"smartnft",
			esc_html__("Addons 🚀",$this->slug ),
			"<div class='animated-gradient-btn smartnft-addons-menu'>Addons 🚀</div>",
			"edit_theme_options",
			"smartnft-addons",
			array($this,"render_root_page"),
			99
		);
	}

	public function render_root_page () {
		echo "<div id='smartnft-root'></div>";
	}

	public function get_addons(){
		return [
			[
				"id"			=> 'smartnft-1155',
				"name" 			=> esc_html__('ERC-1155', $this->slug),
				"desc" 			=> esc_html__('ERC-1155 is a token standard that enables the efficient transfer of fungible and non-fungible tokens in a single transaction', $this->slug),
				"isinstalled" 	=> $this->is_addon_installed( 'smartnft-1155/smartnft-1155.php' ),
				"isactive"		=> $this->is_addon_active( 'smartnft-1155/smartnft-1155.php' ),	
				"url"			=> 'https://wpsmartnft.com/addons/'
			],
			[
				"id"			=> 'smartnft-multichain',
				"name" 			=> esc_html__('Multichain', $this->slug),
				"desc" 			=> esc_html__('Smart NFT Multichain addons enables your site to operate from multiple chain simultaneously.', $this->slug),
				"isinstalled" 	=> $this->is_addon_installed( 'smartnft-multichain/smartnft-multichain.php' ),
				"isactive"		=> $this->is_addon_active( 'smartnft-multichain/smartnft-multichain.php' ),	
				"url"			=> 'https://wpsmartnft.com/addons/'
			],
			[
				"id"			=> 'smartnft-multiwallet',
				"name" 			=> esc_html__('Multiwallet', $this->slug),
				"desc" 			=> esc_html__('Smart NFT Multiwallet helps users to use multiple wallet to mint, buy, sell NFTs', $this->slug),
				"isinstalled" 	=> $this->is_addon_installed( 'smartnft-multiwallet/smartnft-multiwallet.php' ),
				"isactive"		=> $this->is_addon_active( 'smartnft-multiwallet/smartnft-multiwallet.php' ),	
				"url"			=> 'https://wpsmartnft.com/addons/'
			],
			[
				"id"			=> 'smartnft-erc20',
				"name" 			=> esc_html__('BEP/ERC-20', $this->slug),
				"desc" 			=> esc_html__('Use BEP/ERC-20 tokens or custom tokens for creating smart contracts, mint, buy and sell NFTs.', $this->slug),
				"isinstalled" 	=> $this->is_addon_installed( 'smartnft-erc20/smartnft-erc20.php' ),
				"isactive"		=> $this->is_addon_active( 'smartnft-erc20/smartnft-erc20.php' ),	
				"url"			=> 'https://wpsmartnft.com/addons/'
			],
			[
				"id"			=> 'smartnft-auction',
				"name" 			=> esc_html__('Auction', $this->slug),
				"desc" 			=> esc_html__('Helps users to put NFTs on sale with auction features and thus keep it auctionable.', $this->slug),
				"isinstalled" 	=> $this->is_addon_installed( 'smartnft-auction/smartnft-auction.php' ),
				"isactive"		=> $this->is_addon_active( 'smartnft-auction/smartnft-auction.php' ),	
				"url"			=> 'https://wpsmartnft.com/addons/'
			],
			[
				"id"			=> 'smartnft-bulk-mint',
				"name" 			=> esc_html__('Bulk Minting', $this->slug),
				"desc" 			=> esc_html__('Empowers your site to Mint Multiple NFTs at a single time you can do it according to your choices.', $this->slug),
				"isinstalled" 	=> $this->is_addon_installed( 'smartnft-bulk-mint/smartnft-bulk-mint.php' ),
				"isactive"		=> $this->is_addon_active( 'smartnft-bulk-mint/smartnft-bulk-mint.php' ),	
				"url"			=> 'https://wpsmartnft.com/addons/'
			],
			[
				"id"			=> 'smartnft-importer',
				"name" 			=> esc_html__('Importer', $this->slug),
				"desc" 			=> esc_html__('Empowers your site to import NFTs and collection into your site from another contracts or wallet.', $this->slug),
				"isinstalled" 	=> $this->is_addon_installed( 'smartnft-importer/smartnft-importer.php' ),
				"isactive"		=> $this->is_addon_active( 'smartnft-importer/smartnft-importer.php' ),	
				"url"			=> 'https://wpsmartnft.com/addons/'
			],
		];
	}
	public function is_addon_installed($slug){
		return file_exists( WP_PLUGIN_DIR . '/'. $slug );
	}
	public function is_addon_active( $slug ){
		if(in_array($slug, apply_filters('active_plugins', get_option('active_plugins')))){ 
			return true;
		}
		return false;
	}
	public function smartnft_enqueue_backend_script () {
		$local = array(
			"backendMediaUrl"  => BACKEND_MEDIA_URL,
			"frontendMediaUrl" => FRONTEND_MEDIA_URL,
			"backend_ajax_url" => admin_url("admin-ajax.php"),
			"site_root"		   => get_site_url(),
			"site_title"       => get_bloginfo("name") ,
			"active_contract"  => get_option("smartnft_active_contract_address",false),
			"settings"         => get_option("smartnft_settings",false),
			"custom_networks"  => get_option("smartnft_custom_networks", []),
			"addons"		   => $this->get_addons()
		);
		
		if( isset( $_GET["page"] ) && $_GET["page"] === "smartnft_new" ){
			wp_enqueue_script(
				"smartnft_backend_add_new_script",
				BACKEND_SCRIPT_URL . 'add-new-nft.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_backend_add_new_script', $this->slug );
			wp_localize_script(
				"smartnft_backend_add_new_script",
				"local",
				$local
			);
		}

		if( isset( $_GET["page"] ) && $_GET["page"] === "smartnft" ){
			wp_enqueue_script(
				"smartnft_backend_list_script",
				BACKEND_SCRIPT_URL . 'nftlist.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_backend_list_script', $this->slug );
			wp_localize_script(
				"smartnft_backend_list_script",
				"local",
				$local
			);
		}


		if( isset( $_GET["page"] ) && $_GET["page"] === "smartnft-contracts" ) {
			wp_enqueue_script(
				"smartnft_backend_contracts_script",
				BACKEND_SCRIPT_URL . 'smart-contracts.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_backend_contracts_script', $this->slug );
			wp_localize_script(
				"smartnft_backend_contracts_script",
				"local",
				$local
			);
		}

		if( isset( $_GET["page"] ) && $_GET["page"] === "smartnft-collections" ) {
			wp_enqueue_script(
				"smartnft_backend_collections_script",
				BACKEND_SCRIPT_URL . 'collection-list.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_backend_collections_script', $this->slug );
			wp_localize_script(
				"smartnft_backend_collections_script",
				"local",
				$local
			);
		}

		if( isset( $_GET["page"] ) && $_GET["page"] === "smartnft-settings" ) {
			wp_enqueue_script(
				"smartnft_backend_settings_script",
				BACKEND_SCRIPT_URL . 'settings.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_backend_settings_script', $this->slug );
			wp_localize_script(
				"smartnft_backend_settings_script",
				"local",
				$local
			);
		}

		if( isset( $_GET["page"] ) && $_GET["page"] === "smartnft-addons" ) {
			wp_enqueue_script(
				"smartnft_backend_addons_script",
				BACKEND_SCRIPT_URL . 'addons.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_backend_addons_script', $this->slug );
			wp_localize_script(
				"smartnft_backend_addons_script",
				"local",
				$local
			);
		}

		// Backend Category pages
		if( isset( $_GET["page"] ) && $_GET["page"] === "smartnft-category" ) {
			wp_enqueue_script(
				"smartnft_backend_category_script",
				BACKEND_SCRIPT_URL . 'category.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_backend_category_script', $this->slug );
			wp_localize_script(
				"smartnft_backend_category_script",
				"local",
				$local
			);
		}


		//style
		wp_enqueue_style(
			"smartnft_backend_style",
			BACKEND_STYLE_URL . 'style.css',
		);

	}

	public function smartnft_enqueue_frontend_script () {
		$local = array(
			"backendMediaUrl" => BACKEND_MEDIA_URL,
			"frontendMediaUrl" => FRONTEND_MEDIA_URL,
			"backend_ajax_url" => admin_url("admin-ajax.php"),
			"site_root"	=> get_site_url(),
			"site_title"       => get_bloginfo("name") ,
			"active_contract" => get_option("smartnft_active_contract_address",false),
			"settings"	=> get_option("smartnft_settings",false),
			"custom_networks"  => get_option("smartnft_custom_networks", []),
			"escrow_contract"  => get_option("smartnft_importer_escrow_contract_info",false)
		);

		if(is_singular("smartnft") ){
			$tokenid = get_post_meta(get_the_ID(), 'tokenid', true );

			$local['tokenId'] = $tokenid;
			$local['postId'] = get_the_ID();

			wp_enqueue_script(
				"smartnft_front_single_page_script",
				FRONTEND_SCRIPT_URL . 'single.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_front_single_page_script', $this->slug );
			wp_localize_script(
				"smartnft_front_single_page_script",
				"local",
				$local
			);
		}


		if(!is_page("profile") && preg_match('/\/profile\//',$_SERVER["REQUEST_URI"] ) && !is_buddypress_page()){
			wp_enqueue_script(
				"smartnft_front_public_profile_page_script",
				FRONTEND_SCRIPT_URL . 'public-profile.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_front_public_profile_page_script', $this->slug );
			wp_localize_script(
				"smartnft_front_public_profile_page_script",
				"local",
				$local
			);
		}
		
		if( is_tax("smartnft_collection") ){
			$tax_id = get_queried_object_id();
			$local['tax_id'] = $tax_id;
			wp_enqueue_script(
				"smartnft_front_collection_page_script",
				FRONTEND_SCRIPT_URL . 'collection.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_front_collection_page_script', $this->slug );
			wp_localize_script(
				"smartnft_front_collection_page_script",
				"local",
				$local
			);
		}

		if( is_tax("smartnft_category") ){
			$tax_id = get_queried_object_id();
			$local['tax_id'] = $tax_id;
			wp_enqueue_script(
				"smartnft_front_category_page_script",
				FRONTEND_SCRIPT_URL . 'single-category.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_front_category_page_script', $this->slug );
			wp_localize_script(
				"smartnft_front_category_page_script",
				"local",
				$local
			);
		}

		$smartnft_profile__page_id = get_option('smartnft_profile_page_id', false );
		if( is_page($smartnft_profile__page_id) ) {
			wp_enqueue_script(
				"smartnft_front_profile_page_script",
				FRONTEND_SCRIPT_URL . 'profile.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_front_profile_page_script', $this->slug );
			wp_localize_script(
				"smartnft_front_profile_page_script",
				"local",
				$local
			);
		}

		$smartnft_edit_profile_page_id = get_option('smartnft_edit_profile_page_id', false );
		if( is_page($smartnft_edit_profile_page_id) ) {
			wp_enqueue_script(
				"smartnft_front_edit_profile_page_script",
				FRONTEND_SCRIPT_URL . 'edit-profile.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_front_edit_profile_page_script', $this->slug );
			wp_localize_script(
				"smartnft_front_edit_profile_page_script",
				"local",
				$local
			);
		}

		$smartnft_create_collection_page_id = get_option('smartnft_create_collection_page_id', false );
		if( is_page($smartnft_create_collection_page_id) ) {
			wp_enqueue_script(
				"smartnft_front_create_collection_page_script",
				FRONTEND_SCRIPT_URL . 'create-collection.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_front_create_collection_page_script', $this->slug );
			wp_localize_script(
				"smartnft_front_create_collection_page_script",
				"local",
				$local
			);
		}

		$smartnft_all_nft_page_id = get_option('smartnft_all_nft_page_id', false );
		if( is_page($smartnft_all_nft_page_id) ) {
			wp_enqueue_script(
				"smartnft_front_allnft_page_script",
				FRONTEND_SCRIPT_URL . 'allnft.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_front_allnft_page_script', $this->slug );
			wp_localize_script(
				"smartnft_front_allnft_page_script",
				"local",
				$local
			);
		}

		$smartnft_all_collection_page_id = get_option('smartnft_all_collection_page_id', false );
		if( is_page($smartnft_all_collection_page_id) ) {
			wp_enqueue_script(
				"smartnft_front_allcollection_page_script",
				FRONTEND_SCRIPT_URL . 'allcollection.bundle.js',
				array("wp-i18n","jquery"),
				false,
				true
			);
			wp_set_script_translations( 'smartnft_front_allcollection_page_script', $this->slug );
			wp_localize_script(
				"smartnft_front_allcollection_page_script",
				"local",
				$local
			);
		}

		wp_enqueue_style(
			"smartnft_frontend_style",
			FRONTEND_STYLE_URL . 'style.css',
		);

	}

}

new SmartNftBase();
?>
